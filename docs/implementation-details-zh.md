# Agentiq Capital 风险投资演示文稿 - 技术实现文档

## 项目概述

本文档提供了 Agentiq Capital 风险投资演示网站的全面技术概述。这是一个基于滚动的动画演示文稿，旨在给风险投资者留下深刻印象。该演示通过先进的网络技术和精密的视觉效果展示公司的愿景、产品和投资机会。

---

## 目录

1. [技术栈](#技术栈)
2. [项目架构](#项目架构)
3. [设计理念](#设计理念)
4. [组件结构](#组件结构)
5. [动画系统](#动画系统)
6. [可视化组件](#可视化组件)
7. [样式系统](#样式系统)
8. [平滑滚动实现](#平滑滚动实现)
9. [性能优化](#性能优化)
10. [文件结构](#文件结构)

---

## 技术栈

### 核心框架
- **Next.js 16** (App Router) - 具有服务端渲染能力的 React 框架
- **TypeScript** - 类型安全的 JavaScript，提供更好的开发体验和代码可靠性
- **React 19** - 最新版本的 React，性能更优

### 样式
- **Tailwind CSS 4** - 实用优先的 CSS 框架，用于快速 UI 开发
- **CSS 自定义属性** - 用于一致颜色管理的主题变量
- **PostCSS** - CSS 处理和优化

### 动画库
- **GSAP (GreenSock Animation Platform) v3.14** - 行业标准动画库，用于复杂、高性能动画
- **@gsap/react v2.1** - GSAP 的 React 集成
- **Framer Motion v12.28** - React 原生动画库，用于声明式动画和手势

### 平滑滚动
- **Lenis v1.3** - 平滑滚动库，提供丝滑般的滚动体验

### 包管理器
- **pnpm** - 快速、节省磁盘空间的包管理器

---

## 项目架构

### 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # 全局样式和 CSS 变量
│   ├── layout.tsx               # 根布局和元数据
│   └── page.tsx                 # 主演示页面
├── components/
│   ├── navigation/
│   │   └── SlideNav.tsx         # 导航系统
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx  # Lenis 滚动上下文
│   ├── slides/                  # 单独的幻灯片组件
│   │   ├── HeroSlide.tsx
│   │   ├── CompanySlide.tsx
│   │   ├── VisionSlide.tsx
│   │   ├── ProductSlide.tsx
│   │   ├── FeaturesSlide.tsx
│   │   ├── LFMSlide.tsx
│   │   ├── GoToMarketSlide.tsx
│   │   ├── FinanceSlide.tsx
│   │   ├── AskSlide.tsx
│   │   └── ClosingSlide.tsx
│   ├── ui/                      # 可复用 UI 组件
│   │   ├── SlideWrapper.tsx
│   │   ├── AnimatedText.tsx
│   │   └── DataNumber.tsx
│   └── visualizations/          # 数据可视化组件
│       ├── RadialChart.tsx
│       ├── DataSphere.tsx
│       └── ParticleField.tsx
```

### 组件层次结构

```
App (layout.tsx)
└── SmoothScrollProvider
    └── Page (page.tsx)
        ├── SlideNav
        ├── HeroSlide
        │   └── ParticleField
        ├── CompanySlide
        │   └── DataNumber (多个)
        ├── VisionSlide
        ├── ProductSlide
        │   ├── RadialChart
        │   └── DataSphere
        ├── FeaturesSlide
        ├── LFMSlide
        ├── GoToMarketSlide
        ├── FinanceSlide
        │   └── DataNumber (多个)
        ├── AskSlide
        │   └── DataNumber (多个)
        └── ClosingSlide
```

---

## 设计理念

### 品牌标识："彭博终端与当代极简主义的结合"

遵循 `ai-regulate.md` 指南，设计避免常见的 AI 生成模式，拥抱独特的视觉标识：

#### 颜色策略
```css
/* 主色调 */
--color-obsidian: #0a0a0f;      /* 深黑色背景 */
--color-charcoal: #1a1a24;      /* 次要背景 */
--color-graphite: #2a2a3a;      /* 第三级/边框 */

/* 强调色 */
--color-accent-cyan: #00d4ff;    /* 主要强调色 */
--color-accent-burnt: #ff6b35;   /* 次要强调色 */
--color-accent-violet: #8b5cf6;  /* 第三强调色 */
--color-accent-gold: #fbbf24;    /* 高亮强调色 */

/* 文字颜色 */
--color-text-primary: #ffffff;
--color-text-secondary: #a0a0b0;
--color-text-muted: #606070;
```

#### 字体排版
- **Geist Sans** - 标题和正文的主要字体
- **Geist Mono** - 用于数据、数字和技术细节的等宽字体
- **表格数字** - 用于金融数字对齐

#### 布局原则
1. **非对称布局** - 有意打破网格
2. **俄罗斯方块式构图** - 非均匀内容块
3. **大量留白** - 昂贵、有意的间距
4. **数据即视觉艺术** - 数字和图表作为设计元素

---

## 组件结构

### SlideWrapper 组件

所有幻灯片的基础组件，提供一致的结构和动画：

```typescript
interface SlideWrapperProps {
  children: React.ReactNode;
  id: string;
  background?: "dark" | "darker" | "accent";
  className?: string;
}
```

**功能特点：**
- 用于视口检测的 Intersection Observer
- Framer Motion 入场动画
- 一致的内边距和布局
- 背景颜色变体

### AnimatedText 组件

处理逐词或逐字符的文本揭示动画：

```typescript
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "words" | "chars";
}
```

**动画技术：**
- 将文本拆分为单独的元素
- 使用 Framer Motion 的 `staggerChildren` 进行顺序揭示
- 可配置的延迟和交错时间

### DataNumber 组件

带有弹簧物理效果的动画数字计数器：

```typescript
interface DataNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}
```

**功能特点：**
- 使用 Framer Motion 的 `useSpring` 实现平滑计数
- 可配置的小数位数
- 前缀/后缀支持（如 "$"、"M"、"%"）
- 进入视口时触发

---

## 动画系统

### GSAP 集成

GSAP 用于复杂的、基于时间线的动画：

```typescript
// 示例：交错元素揭示
gsap.fromTo(
  elements,
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  }
);
```

**使用的关键 GSAP 功能：**
- `gsap.fromTo()` - 明确的开始/结束状态
- `stagger` - 顺序元素动画
- `ScrollTrigger` 潜力（为未来使用做准备）
- 自定义缓动函数

### Framer Motion 集成

Framer Motion 处理 React 原生动画：

```typescript
// 示例：幻灯片入场动画
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
```

**关键 Framer Motion 功能：**
- `useInView` 钩子用于视口检测
- `motion` 组件用于声明式动画
- `AnimatePresence` 用于退出动画
- 自定义三次贝塞尔缓动

### 动画时间策略

```
幻灯片入场时间线：
0ms    - 幻灯片变为可见
100ms  - 章节标签淡入
300ms  - 主标题动画
500ms  - 正文揭示
700ms  - 数据/可视化动画
1000ms - 次要元素出现
```

---

## 可视化组件

### RadialChart 组件

代表方法论层次的5层同心圆可视化：

```typescript
interface RadialChartProps {
  layers: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
  className?: string;
}
```

**技术实现：**
- 基于 SVG 的渲染
- 为每层计算周长
- 使用 `strokeDasharray` 和 `strokeDashoffset` 实现进度动画
- GSAP 驱动的揭示动画
- 用于发光效果的阴影滤镜

**表示的层次：**
1. 市场（最外层）
2. 基本面
3. 技术面
4. 量化
5. 动态（最内层）

### DataSphere 组件

带有数据点的3D旋转球体：

```typescript
interface DataSphereProps {
  size?: number;
  className?: string;
  pointCount?: number;
}
```

**技术实现：**
- 斐波那契球体点分布算法
- 3D 到 2D 投影数学
- 通过 GSAP 实现连续旋转动画
- 仅客户端渲染以避免水合问题

**点生成算法：**
```typescript
for (let i = 0; i < pointCount; i++) {
  const phi = Math.acos(-1 + (2 * i) / pointCount);
  const theta = Math.sqrt(pointCount * Math.PI) * phi;
  
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
}
```

### ParticleField 组件

基于 Canvas 的粒子网络动画：

```typescript
interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: string;
}
```

**技术实现：**
- 使用 HTML5 Canvas 以提高性能
- 粒子物理模拟（速度、位置）
- 相邻粒子之间的连接线
- 边缘环绕以实现连续效果
- 使用 RequestAnimationFrame 实现平滑的 60fps 动画

**粒子属性：**
```typescript
interface Particle {
  x: number;      // 位置 (0-100%)
  y: number;
  vx: number;     // 速度
  vy: number;
  size: number;   // 半径
  opacity: number;
}
```

---

## 样式系统

### CSS 自定义属性

所有颜色和主题值都在 `globals.css` 中定义为 CSS 变量：

```css
:root {
  /* 颜色 */
  --color-obsidian: #0a0a0f;
  --color-charcoal: #1a1a24;
  /* ... */
  
  /* 字体 */
  --font-sans: "Geist Sans", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;
  
  /* 间距 */
  --slide-padding: clamp(2rem, 5vw, 6rem);
}
```

### Tailwind CSS 4 配置

使用新的 CSS 优先配置方法：

```css
@import "tailwindcss";

@theme {
  --color-obsidian: #0a0a0f;
  --color-charcoal: #1a1a24;
  /* ... */
}
```

### 响应式设计

所有幻灯片都完全响应式，使用：
- CSS `clamp()` 实现流体排版
- Tailwind 响应式前缀（`md:`、`lg:`）
- CSS Grid 的 auto-fit/auto-fill
- Flexbox 实现灵活布局

```css
/* 示例：响应式标题 */
.slide-heading {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

---

## 平滑滚动实现

### Lenis 配置

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
});
```

### SmoothScrollProvider

初始化和管理 Lenis 的 React 上下文提供者：

```typescript
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

---

## 性能优化

### 水合不匹配预防

使用 `Math.random()` 或动态计算的组件仅在客户端渲染：

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// 仅在挂载后渲染动态内容
{isMounted && <DynamicContent />}
```

### 动画性能

1. **GPU 加速** - 使用 `transform` 和 `opacity` 进行动画
2. **Will-change** - 应用于动画元素
3. **RequestAnimationFrame** - 用于 canvas 动画
4. **Intersection Observer** - 动画仅在可见时触发

### 代码分割

每个幻灯片组件都是单独的文件，实现：
- 懒加载潜力
- 更好的 tree shaking
- 更容易维护

---

## 文件结构

### 完整文件列表

```
dev-pitch-site/
├── docs/
│   ├── ai-regulate.md           # 设计指南
│   ├── dev-rule.md              # 开发规则
│   ├── guide.md                 # 项目需求
│   ├── implementation-details-en.md  # 英文文档
│   └── implementation-details-zh.md  # 本文件
├── public/
│   └── [静态资源]
├── src/
│   ├── app/
│   │   ├── globals.css          # ~200 行
│   │   ├── layout.tsx           # ~30 行
│   │   └── page.tsx             # ~50 行
│   └── components/
│       ├── navigation/
│       │   └── SlideNav.tsx     # ~150 行
│       ├── providers/
│       │   └── SmoothScrollProvider.tsx  # ~40 行
│       ├── slides/
│       │   ├── HeroSlide.tsx    # ~120 行
│       │   ├── CompanySlide.tsx # ~180 行
│       │   ├── VisionSlide.tsx  # ~150 行
│       │   ├── ProductSlide.tsx # ~200 行
│       │   ├── FeaturesSlide.tsx # ~220 行
│       │   ├── LFMSlide.tsx     # ~180 行
│       │   ├── GoToMarketSlide.tsx # ~200 行
│       │   ├── FinanceSlide.tsx # ~250 行
│       │   ├── AskSlide.tsx     # ~220 行
│       │   └── ClosingSlide.tsx # ~100 行
│       ├── ui/
│       │   ├── SlideWrapper.tsx # ~60 行
│       │   ├── AnimatedText.tsx # ~80 行
│       │   └── DataNumber.tsx   # ~50 行
│       └── visualizations/
│           ├── RadialChart.tsx  # ~160 行
│           ├── DataSphere.tsx   # ~170 行
│           └── ParticleField.tsx # ~140 行
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 幻灯片内容摘要

| 幻灯片 | 目的 | 关键元素 |
|--------|------|----------|
| Hero | 介绍 | 公司名称、标语、粒子动画 |
| Company | 概述 | 统计数据（成立时间、重点、愿景）、技术栈 |
| Vision | ASI 使命 | 规范理论/算子理论/测度理论、使命宣言 |
| Product | 可视化引擎 | RadialChart 演示、DataSphere 演示 |
| Features | MVP 1.0/1.1 | 功能列表、Vibe Trading 概念 |
| LFM | 大型金融模型 | 5倍密度增加、条形图 |
| Go-To-Market | 策略 | Reddit、SEO、时间线 |
| Finance | 估值 | TAM/SAM/SOM、收入预测 |
| Ask | 投资请求 | 200万美元种子轮、资金用途、里程碑 |
| Closing | 感谢 | 联系信息、行动号召 |

---

## 运行项目

### 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 环境要求

- Node.js 18+
- pnpm 8+

---

## 未来增强

1. **键盘导航** - 使用方向键进行幻灯片导航
2. **演示者模式** - 演示笔记和计时器
3. **移动端触摸手势** - 滑动导航
4. **加载动画** - 带进度的预加载器
5. **PDF 导出** - 生成静态 PDF 版本
6. **分析** - 跟踪幻灯片参与度

---

## 总结

这个风险投资演示文稿代表了现代网络技术的精密实现，结合了 Next.js 16、GSAP、Framer Motion 和自定义可视化，为潜在投资者创造了令人印象深刻、难忘的体验。模块化架构确保了可维护性，而遵循"彭博终端与当代极简主义结合"理念的设计细节创造了独特的品牌标识，使其从典型的创业公司演示中脱颖而出。

---

## 技术亮点

### 为什么选择这些技术？

| 技术 | 选择原因 |
|------|----------|
| Next.js 16 | 最新的 App Router、服务端渲染、优秀的开发体验 |
| TypeScript | 类型安全、更好的 IDE 支持、减少运行时错误 |
| Tailwind CSS 4 | 快速开发、一致的设计系统、小的包体积 |
| GSAP | 行业标准、高性能、复杂动画支持 |
| Framer Motion | React 原生、声明式 API、手势支持 |
| Lenis | 平滑滚动、轻量级、易于集成 |
| pnpm | 快速安装、节省磁盘空间、严格的依赖管理 |

### 设计决策

1. **深色主题** - 专业、现代、减少眼睛疲劳
2. **青色强调色** - 科技感、与金融行业的蓝色区分
3. **等宽字体用于数据** - 数字对齐、技术感
4. **大量留白** - 高端感、内容聚焦
5. **非对称布局** - 打破模板感、独特性

### 动画原则

1. **微妙而自信** - 不花哨、专业
2. **有目的** - 每个动画都有意义
3. **性能优先** - 60fps、GPU 加速
4. **渐进增强** - 基础功能不依赖动画
