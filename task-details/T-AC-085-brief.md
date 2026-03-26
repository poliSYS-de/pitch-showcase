# T-AC-085 — Deploy: Full Demo auf polisys.de/coding/pitch-showcase/

> **Prio:** P1 | **Zugewiesen:** DevOps (T800)
> **Dep:** T-AC-082 (Docs Hub, ready for QA) — kann parallel starten
> **Zweck:** Voll-funktionale Live-Demo des Pitch Preparation Center auf eigenem poliSYS-Server, solange kein AWS-Zugang vom CEO vorliegt. KEINE Read-Only-Einschraenkung — das ist unsere Demo-Instanz.

---

## Architektur-Entscheidung: Eigenes Fork-Repo

Das Original-Repo (`poliSYS-de/AgenticCapital` o.ae.) gehoert dem Kunden-Projekt und darf NICHT mit Deployment-Config (basePath, Dockerfile) verschmutzt werden.

**Loesung:** Eigenes Repo `poliSYS-de/pitch-showcase` als Fork im poliSYS GitHub Account.

```
poliSYS-de/AgenticCapital (Original)
  └── main = Entwicklung, Kunden-AWS-Deploy

poliSYS-de/pitch-showcase (Fork/Klon)
  └── main = polisys.de Demo
       + next.config.ts (basePath + output:standalone)
       + Dockerfile (multi-stage build)
       + docker-compose.yml (Traefik labels)
```

**Update-Workflow:**
```bash
cd /opt/polisys-pitch-showcase/Dev-pitch-site
git remote add upstream <ORIGINAL-REPO-URL>
git pull upstream main   # Neue Features holen
# Merge-Konflikte nur in next.config.ts (basePath) — trivial
docker compose up -d --build
```

---

## Tasks fuer DevOps

### 1. Fork-Repo anlegen auf GitHub

```bash
# Option A: GitHub CLI (wenn gh verfuegbar)
gh repo create poliSYS-de/pitch-showcase --public --description "poliSYS Pitch Preparation Center — Live Demo"

# Option B: Manuell auf https://github.com/orgs/poliSYS-de/dashboard → New Repository
# Name: pitch-showcase
# Visibility: Public (ist ein Showcase!)
# Keine Template, kein README (kommt aus dem Fork)
```

### 2. Repo mit Kunden-Code befuellen

```bash
# Auf dem Hetzner-Server oder lokal:
git clone git@github-deploy:poliSYS-de/AgenticCapital.git pitch-showcase-temp
cd pitch-showcase-temp

# Remote umbiegen auf neues Repo
git remote set-url origin git@github-deploy:poliSYS-de/pitch-showcase.git
git remote add upstream git@github-deploy:poliSYS-de/AgenticCapital.git
git push -u origin main
```

### 3. Deployment-Dateien hinzufuegen (NUR im Fork)

Folgende Dateien erstellen im Fork (Dev-pitch-site/):

**a) next.config.ts** — basePath + standalone:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/coding/pitch-showcase",
  assetPrefix: "/coding/pitch-showcase",
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
```

**b) Dockerfile** — Multi-Stage Build:
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3010 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3010
CMD ["node", "server.js"]
```

**c) docker-compose.yml** — Traefik + Volumes:
```yaml
version: "3.8"
services:
  pitch-showcase:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: polisys-pitch-showcase
    restart: unless-stopped
    volumes:
      - ./deck-config.json:/app/deck-config.json
      - ./assets.json:/app/assets.json
      - ./docs-registry.json:/app/docs-registry.json
      - ./public/images/upload:/app/public/images/upload
      - ./docs:/app/docs
      - ./task-details:/app/task-details
      - ./task-liste.md:/app/task-liste.md
      - ./task-liste-archiv.md:/app/task-liste-archiv.md
    environment:
      - NODE_ENV=production
      - PORT=3010
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.pitch-showcase.rule=Host(`polisys.de`) && PathPrefix(`/coding/pitch-showcase`)"
      - "traefik.http.routers.pitch-showcase.entrypoints=websecure"
      - "traefik.http.routers.pitch-showcase.tls.certresolver=letsencrypt"
      - "traefik.http.services.pitch-showcase.loadbalancer.server.port=3010"
      - "traefik.docker.network=polisys-proxy"
    networks:
      - polisys-proxy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3010/coding/pitch-showcase"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 40s
networks:
  polisys-proxy:
    external: true
```

### 4. DNS klären

`polisys.de` zeigt aktuell auf `159.69.132.200` (FEBAS). Traefik auf `23.88.59.57` braucht Host-Match.

**Optionen (Admin-Entscheidung):**
- **A:** DNS polisys.de → 23.88.59.57 umstellen (betrifft Hauptseite!)
- **B:** Subdomain `showcase.polisys.de` → 23.88.59.57 (sicherer, aber anderer Pfad)
- **C:** Direkt IP:Port — kein HTTPS, nur temporär

→ Admin fragen welche Option

### 5. Docker Build + Start auf Hetzner

```bash
ssh -i ~/.ssh/id_ed25519_devops root@23.88.59.57
cd /opt
git clone git@github-deploy:poliSYS-de/pitch-showcase.git polisys-pitch-showcase
cd polisys-pitch-showcase/Dev-pitch-site
docker compose up -d --build
docker logs -f polisys-pitch-showcase
```

### 6. Update-Workflow dokumentieren

```bash
# Neue Features aus Original-Repo holen:
cd /opt/polisys-pitch-showcase
git pull upstream main
cd Dev-pitch-site
docker compose up -d --build
```

---

## Akzeptanzkriterien

- [ ] Fork-Repo `poliSYS-de/pitch-showcase` existiert auf GitHub
- [ ] Original-Repo hat KEINE Deployment-Dateien (basePath, Dockerfile)
- [ ] Fork hat Dockerfile + docker-compose.yml + angepasste next.config.ts
- [ ] Container laeuft auf Hetzner (polisys-pitch-showcase)
- [ ] URL erreichbar (DNS abhaengig — Option A/B/C)
- [ ] Alle Features funktionieren (Slides, Brand Assets, Docs Hub)
- [ ] Schreiboperationen funktionieren (Config speichern, Assets editieren)
- [ ] Update-Workflow getestet (git pull upstream main + rebuild)

---

*Brief: PM Robocop | 26.03.2026 | Strategie: Fork-Repo im poliSYS Account*
