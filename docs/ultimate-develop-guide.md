# Ultimate Developer Guide — VC Pitch Slide Deck

本文档为 Agentiq Capital 项目的综合技术指引，涵盖动画、滚动、组件协作的架构设计、常见问题与最佳实践。适用于实现炫酷的 slide in、fade out、smooth scroll 等效果时的技术决策与开发参考。

---

## 一、项目定位与架构概览

### 1.1 项目目的
- **形式**：VC Pitch Slide Deck（投资演示幻灯片网站）
- **目标**：通过交互式幻灯片呈现公司愿景、产品、市场策略，结合 Bloomberg 终端专业感与现代极简风格
- **核心体验**：流畅滚动、富有表现力的进场/退场动画、高端金融科技视觉

### 1.2 技术栈与职责划分

| Package | 版本 | 职责 | 负责的效果类型 |
|--------|------|------|----------------|
| **Lenis** | ^1.3.17 | 平滑滚动引擎 | 整体页面的 smooth scroll、程序化滚动（如导航跳转） |
| **Framer Motion** | ^12.28.1 | React 声明式动画、视口检测 | Slide 进场、组件过渡、`useInView` 驱动的动画、Motion 值 |
| **GSAP** | ^3.14.2 | 复杂时间轴、逐字/ stagger 动画 | 字母翻转、多元素序列动画、精细控制 |
| **D3** | ^7.9.0 | 数据可视化 | 图表、数据驱动图形（非动画主逻辑） |

**原则**：各库职责清晰，避免重叠与冲突；与 Lenis 相关的滚动驱动动画需特别谨慎。

---

## 二、三大库的职责边界

### 2.1 Lenis — 只负责「如何滚动」

**职责**：
- 将用户滚轮/触摸转为平滑的滚动体验
- 提供 `lenis.scrollTo()` 等程序化滚动 API
- 管理自身的 `raf` 循环和内部滚动状态

**使用场景**：
- `SmoothScrollProvider` 初始化 Lenis，包裹整站
- `SlideNav` 中 `lenis.scrollTo(\`#${id}\`, { duration: 3 })` 实现导航跳转
- 不用于驱动具体组件的 opacity、scale、y 等视觉动画

**注意**：Lenis 使用原生滚动机制，但通过自己的动画循环进行插值。`window.scrollY` 会更新，但与 Framer Motion 的 `useScroll` 在**针对具体元素的 scroll progress** 上存在兼容性问题（见下文）。

### 2.2 Framer Motion — 负责「何时」与「怎么动」

**职责**：
- 声明式 React 动画：`initial`、`animate`、`variants`
- 视口检测：`useInView`（基于 IntersectionObserver）
- 运动值：`useMotionValue`、`useTransform`
- 布局与过渡：`AnimatePresence`、`layout`

**推荐使用**：
- `useInView`：驱动 slide 内组件的进场动画（与 Lenis 无冲突）
- `motion.*` + `animate={isInView ? {...} : {}}`：可靠的进场模式
- `useMotionValue` + 手动更新（如 IntersectionObserver 回调）：自定义驱动逻辑
- `useScroll()` **不带 target**：整页滚动进度（如 SlideNav 顶部进度条）— 风险较低
- `useSpring`：平滑数值过渡

**禁止使用**（与 Lenis 联用时会出错）：
- `useScroll({ target: ref })` + `scrollYProgress` 驱动 **opacity** 或 **scale**
- 原因：`scrollYProgress` 依赖原生滚动位置与元素边界，与 Lenis 的滚动节奏不同步，易导致内容在应可见时被错误隐藏

### 2.3 GSAP — 负责「复杂序列」与「精确控制」

**职责**：
- 多元素 stagger 动画（如逐字翻转）
- 复杂 timeline、精细 easing
- 非 React 生命周期的 imperative 动画

**推荐使用**：
- 在 `useEffect` 中，当 `isInView === true` 时执行 `gsap.fromTo()` 或 `gsap.timeline()`
- 对 `querySelectorAll` 得到的多个子元素做 stagger
- 使用 `power3.out`、`power2.inOut` 等 GSAP easing

**注意**：
- GSAP 动画应由 **Framer Motion 的 useInView** 触发，不要用 `useScroll` 的 `scrollYProgress` 触发
- 确保 `isInView` 的 ref 放在 slide 的**最外层可见内容容器**上（与 ClosingSlide、HeroSlide 一致）

---

## 三、核心冲突：Lenis + useScroll(target)

### 3.1 问题现象
- Desktop 端部分或全部 slide 内容不显示（仅背景/粒子可见）
- 内容在应可见时呈透明或极小状态

### 3.2 根本原因
- Lenis 使用自己的动画循环与内部状态
- Framer Motion 的 `useScroll({ target: ref })` 依赖 `window.scrollY` 与元素 `getBoundingClientRect` 计算 `scrollYProgress`
- 二者节奏不同步，导致 `scrollYProgress` 在初始化或滚动过程中返回错误值
- 若将 `scrollYProgress` 绑定到 opacity/scale，会错误地隐藏本应可见的内容

### 3.3 解决方案（已采用）
- **ScrollExitWrapper**：用 **IntersectionObserver** 替代 `useScroll`，根据 `intersectionRatio` 计算 opacity、scale、y
- IntersectionObserver 基于真实 DOM 可见性，与 Lenis 无关，可稳定工作
- 阈值 `[0, 0.05, ..., 1]` 实现平滑过渡；ratio ≥ 0.4 时完全不透明，< 0.4 时按比例淡出；可选 `yOffset` 调节上移幅度
- 详见 `docs/display-issue-summary.md`

### 3.4 如何确保不再复发
- **禁止**：用 `useScroll` / `scrollYProgress` 驱动 opacity 或 scale；与 Lenis 联用时 scroll 进度不可靠，会遮蔽内容
- **推荐**：基于滚动的可见性/退场一律用 IntersectionObserver（ScrollExitWrapper）或 Lenis 自身 API 驱动
- Slide 内进场：`useInView(ref, { amount: 0.5 })`，ref 指向 slide 最外层内容容器
- 新增或修改 slide 后，Desktop 与 Mobile 各做一次完整浏览验证

### 3.5 Desktop / Mobile 行为
- **Mobile**：ScrollExitWrapper 返回普通 div，无退场特效；SlideWrapper 使用简化 fade up
- **Desktop**：ScrollExitWrapper 使用 IntersectionObserver 驱动 fade/scale/y，保证内容可见且退场明显；Slide 内 useInView 使用 amount: 0.5，ref 在外层容器上

### 3.6 规则总结
| 需求 | 可用 | 不可用 |
|------|------|--------|
| 元素进入视口时触发动画 | `useInView` | `useScroll(target)` |
| 元素离开视口时的 fade/scale | IntersectionObserver + `useMotionValue` | `useScroll` 驱动 opacity/scale |
| 整页滚动进度（如顶栏） | `useScroll()` 无 target | — |
| 程序化滚动到某 slide | `lenis.scrollTo()` | — |

---

## 四、动画实现模式

### 4.1 Slide 进场（Slide In）

**组件**：`SlideWrapper`  
**实现**：Framer Motion `variants` + `useInView`

```
SlideWrapper
├── ref → useInView(ref, { once: true, amount: 0 })
├── initial="hidden" / animate={isInView ? "visible" : "hidden"}
└── Desktop: 3D 进场 (scale, rotateX, rotateZ)
    Mobile: 简化 fade up
```

**新增 slide 时**：必须用 `SlideWrapper` 包裹，并保证 `ref` 用于 `useInView` 时指向稳定的容器元素。

### 4.2 Slide 内内容进场

**推荐模式**（参考 HeroSlide、ClosingSlide）：

```tsx
const ref = useRef<HTMLDivElement>(null);
const logoRef = useRef<HTMLDivElement>(null);
const isInView = useInView(ref, { once: true, amount: 0.5 });

// 1. GSAP：复杂 stagger（字母、多元素）
useEffect(() => {
  if (!logoRef.current || !isInView) return;
  const letters = logoRef.current.querySelectorAll(".hero-letter");
  gsap.fromTo(letters, { opacity: 0, y: 100, rotateX: -90 }, { ... });
}, [isInView]);

// 2. Framer Motion：简单过渡
<motion.p
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: 0.5 }}
/>
```

**要点**：
- `ref` 放在 slide 内容的最外层容器（与 HeroSlide、CompanySlide 一致）：`<SlideWrapper><div ref={ref}><ScrollExitWrapper>...</ScrollExitWrapper></div></SlideWrapper>`
- `amount: 0.5` 统一使用，保证滚动进入时稳定触发
- 使用 `animate={isInView ? {...} : {}}` 避免 useEffect 时序问题

**重复触发（每次滚动进入都播放进场动画）**：
- `useInView(ref, { once: false, amount: 0.5 })`
- 所有 `motion.*` 在离开视口时需回到「隐藏」状态：`animate={isInView ? { opacity: 1, ... } : { opacity: 0, ... }}`，右侧对象与 `initial` 一致（如 `{ opacity: 0, x: -50 }`）
- 若使用 GSAP（如 HeroSlide 字母、LFMSlide 柱状图、FinanceSlide 曲线）：在 `useEffect` 中当 `!isInView` 时执行 `gsap.set(elements, initialValues)` 重置，以便再次进入时 `fromTo` 能重播
- 若使用 AnimatedText（内部 `once: true`）：父级可传 `key={isInView ? 'in' : 'out'}`，离开视口时卸载、再次进入时重新挂载以重播

**飞入动画参数建议**（与 HeroSlide/CompanySlide 一致）：
- Section label：`initial={{ opacity: 0, x: -50 }}`，从左滑入
- 主标题：`initial={{ opacity: 0, y: 70 }}`，从下滑入
- 正文/卡片：`initial={{ opacity: 0, y: 50 }}` 或 `y: 60`
- 左右分栏：左侧 `x: -60`，右侧 `x: 60`，形成对称飞入
- 卡片/图表：`y: 50` + `scale: 0.95` 增加层次感
- 统一 easing：`ease: [0.16, 1, 0.3, 1]`
- Stagger：`delay: 0.3 + i * 0.12` 等

### 4.3 Slide 退场（Fade Out / Exit）

**组件**：`ScrollExitWrapper`  
**实现**：IntersectionObserver + `useMotionValue`

```
ScrollExitWrapper (Desktop only)
├── IntersectionObserver(threshold: [0, 0.05, ..., 1])
├── ratio >= 0.4 → opacity 1, scale 1
├── ratio < 0.4  → 按比例淡出、微缩、y 上移
└── Mobile: 返回普通 div，无退出特效
```

**使用**：包裹需要退场效果的内容块，可选 `yOffset` 调节上移幅度。

### 4.4 平滑滚动（Smooth Scroll）

**实现**：Lenis 在 `SmoothScrollProvider` 中初始化，包裹 `<main>`。

- 用户滚轮/触摸 → Lenis 平滑处理
- 导航点击 → `lenis.scrollTo(\`#${id}\`, { duration: 3 })`
- 无需在业务组件中额外处理

---

## 五、组件层级与使用顺序

```
SmoothScrollProvider (Lenis)
└── main
    ├── SlideNav (lenis.scrollTo, useScroll 无 target)
    └── SlideWrapper (useInView, variants)
        └── [Slide 内容]
            ├── ParticleField / 背景
            ├── ScrollExitWrapper (IntersectionObserver)
            │   └── 正文、标题、图表等
            └── 装饰元素
```

**新增 Slide 的推荐结构**：

```tsx
<SlideWrapper id="xxx" background="darker">
  <div ref={ref} className="...">
    <ParticleField />  {/* 可选 */}
    <ScrollExitWrapper className="...">
      {/* 主要内容：motion + isInView 或 GSAP + isInView */}
    </ScrollExitWrapper>
  </div>
</SlideWrapper>
```

---

## 六、响应式规则（768px 分界）

| 特性 | Desktop (>768px) | Mobile (≤768px) |
|------|------------------|-----------------|
| Slide 进场 | 3D 缩放、旋转 | 简化 fade up |
| ScrollExitWrapper | IntersectionObserver 退出效果 | 普通 div，无效果 |
| useInView amount | 0 或 0.3–0.5 | 同上 |
| 粒子等重效果 | 开启 | 可适当减量 |

实现位置：`SlideWrapper`、`ScrollExitWrapper` 内部通过 `window.innerWidth < 768` 分支。

---

## 七、决策树：该用谁？

```
需要动画？
├── 仅「进入视口时播放」 → useInView + (Framer Motion 或 GSAP)
│   ├── 简单属性过渡 → motion.* + animate={isInView ? {...} : {}}
│   └── 多元素 stagger → GSAP + useEffect([isInView])
├── 需要「滚动离开时的淡出」 → ScrollExitWrapper（内部用 IntersectionObserver）
├── 需要「整页滚动进度」 → useScroll() 无 target
└── 需要「滚动到某位置」 → lenis.scrollTo()

切忌：useScroll({ target }) + scrollYProgress → opacity/scale
```

---

## 八、常见陷阱与排查

### 8.1 内容不显示（Desktop）
- 检查是否用 `useScroll` 的 `scrollYProgress` 驱动 opacity/scale
- 若有，改为 IntersectionObserver 或移除对 opacity/scale 的绑定

### 8.2 进场动画不触发
- 确认 `useInView` 的 ref 在最外层内容容器
- 尝试 `amount: 0` 或 `amount: 0.3`–`0.5`
- 优先用 `animate={isInView ? {...} : {}}`，避免依赖复杂的 useEffect 时序

### 8.3 动画闪现或错乱
- 避免在 useEffect 中为「是否可见」做 setState 驱动渲染
- 若只需首次进入播放：`once: true`；若需重复触发：`once: false` 且所有 motion 在 `!isInView` 时显式回到 initial 状态
- GSAP timeline 在 useEffect 的 cleanup 中 `tl.kill()`；重复触发时在 `!isInView` 分支里 `gsap.set` 重置元素

### 8.4 首屏 Slide 动画异常
- 参考 HeroSlide、ClosingSlide：ref 放外层，amount 0.5
- 确保 SlideWrapper 的 `amount: 0` 能正确触发

---

## 九、参考实现

| 场景 | 参考组件 |
|------|----------|
| Slide 进场 | SlideWrapper |
| 内容退场 | ScrollExitWrapper |
| 字母/stagger 进场 | HeroSlide、ClosingSlide |
| Motion + isInView + 重复触发 | HeroSlide、CompanySlide、VisionSlide、ProductSlide、VisualsSlide、FeaturesSlide、LFMSlide、GoToMarketSlide、FinanceSlide、AskSlide |
| GSAP + useInView + 离场 reset | HeroSlide（字母）、LFMSlide（柱状图/连线）、FinanceSlide（曲线/圆点） |
| AnimatedText + 重复触发 | CompanySlide（`key={isInView ? 'in' : 'out'}`） |
| 程序化滚动 | SlideNav (`lenis.scrollTo`) |
| 整页进度条 | SlideNav (`useScroll` 无 target) |

**当前站点 Slide 列表**：Hero → Company → Vision → Product → Visuals → Features → LFM → Go-To-Market → Finance → The Ask → Closing；上述 slide 均采用「外层 ref + useInView(amount: 0.5) + ScrollExitWrapper(yOffset) + 统一 ease」模式，详见 `docs/display-issue-summary.md`。

---

## 十、后续开发检查清单

- [ ] 新 Slide 用 SlideWrapper 包裹
- [ ] Slide 内容最外层为 `<div ref={ref}>`，其内为 ScrollExitWrapper；需要退场时用 ScrollExitWrapper，且不在此处使用 useScroll
- [ ] 进场动画用 useInView(ref, { amount: 0.5 }) 触发；若需重复触发则 `once: false` 且所有 motion 在 `!isInView` 时显式回到 initial 状态（GSAP 需在离场时 set 重置）
- [ ] 不在 useScroll(target) 的 scrollYProgress 上绑定 opacity/scale
- [ ] Desktop 与 Mobile 均做一次完整浏览验证
