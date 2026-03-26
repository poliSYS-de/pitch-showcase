# Agentiq Capital 网站开发文档

## 1. 项目概览
本项目是一个基于 Next.js 构建的风险投资（VC）展示网站（Pitch Deck）。设计理念结合了彭博终端（Bloomberg Terminal）的专业感与现代极简主义风格，旨在通过交互式幻灯片展示 Agentiq Capital 的愿景、产品和市场策略。

## 2. 核心技术栈
- **框架**: Next.js (App Router)
- **样式**: Tailwind CSS (v4) + CSS Variables (OKLCH 色彩系统)
- **动画**: 
  - Framer Motion (组件级过渡与交互)
  - GSAP (复杂的时间轴动画)
- **滚动**: Lenis (平滑滚动体验)

## 3. 动画与响应式规则 (重要)
项目中有一条核心的开发规则，用于平衡视觉效果与移动端性能/体验：

**规则：屏幕宽度 768px 是动画效果的分界线。**

### Desktop (> 768px)
- **状态**: 所有动画和特效**开启**。
- **行为**: 
  - 幻灯片（Slide）切换具有复杂的 3D 进场效果（缩放、旋转、位移）。
  - 滚动视差效果（Parallax）启用。
  - 粒子效果和其他高负载视觉元素完整呈现。

### Mobile (< 768px)
- **状态**: 复杂动画**关闭**或**简化**。
- **行为**: 
  - 幻灯片切换简化为基础的淡入位移（Fade Up），移除 3D 旋转和缩放。
  - 滚动视差效果（Scroll Exit Effects）完全禁用，回退为普通静态布局。
  - 这种处理方式确保了在小屏设备上的流畅性和可读性。

### 代码实现位置
此规则主要在以下组件中通过 `window.innerWidth < 768` 判断实现：
1. **`src/components/ui/SlideWrapper.tsx`**: 控制幻灯片进场动画的复杂度。
2. **`src/components/ui/ScrollExitWrapper.tsx`**: 在移动端直接返回普通 `div`，禁用 `motion.div` 的滚动变换效果。

## 4. 幻灯片列表（当前站点）
主页面顺序：**Hero** → **Company** → **Vision** → **Product** → **Visuals** → **Features** → **LFM** → **Go-To-Market** → **Finance** → **The Ask** → **Closing**。

各 slide 均采用统一进场/退场模式：外层 `div ref={ref}` + `useInView(ref, { amount: 0.5 })` + `ScrollExitWrapper(yOffset)`，飞入参数与 `ease: [0.16, 1, 0.3, 1]` 一致；部分 slide 支持**重复触发**（每次滚动进入视口都重新播放进场动画）。详见 `docs/ultimate-develop-guide.md` 与 `docs/display-issue-summary.md`。

## 5. 目录结构
- **`src/app`**: 页面路由与全局布局。
  - `globals.css`: 定义了全局设计系统（颜色、排版、基础样式）。
  - `page.tsx`: 主页面，包含所有幻灯片组件。
- **`src/components/slides`**: 具体的幻灯片页面组件（如 `HeroSlide`, `CompanySlide`, `VisionSlide`, `ProductSlide`, `VisualsSlide`, `FeaturesSlide`, `LFMSlide`, `GoToMarketSlide`, `FinanceSlide`, `AskSlide`, `ClosingSlide` 等）。
- **`src/components/ui`**: 通用 UI 组件（如 `SlideWrapper`、`ScrollExitWrapper`、`AnimatedText`）。
- **`src/components/visualizations`**: 数据可视化与特效组件（如 `ParticleField`、`RadialChart`、`GradientSunburst`、`DataSphere`）。
- **`src/components/providers`**: 全局 Context 提供者（如 `SmoothScrollProvider`）。

## 6. 设计系统
- **色彩**: 采用 OKLCH 色彩空间，主色调为深色（Charcoal/Obsidian），强调色为绿色（Primary Green）。
- **排版**: 使用 `Geist Sans` 和 `Geist Mono` 字体，呈现科技金融感。
- **布局**: 采用非对称网格（Asymmetric Grid）和终端风格网格（Terminal Grid）。

## 7. 开发指南
- 新增幻灯片时，请务必使用 `SlideWrapper` 包裹内容；内容最外层为 `<div ref={ref}>`，其内使用 `ScrollExitWrapper` 包裹需退场效果的内容，进场由 `useInView(ref, { amount: 0.5 })` 驱动。详见 `docs/ultimate-develop-guide.md`。
- **禁止**使用 `useScroll(target)` / `scrollYProgress` 驱动 opacity 或 scale（与 Lenis 冲突会导致桌面端内容不显示）；退场与可见性一律用 IntersectionObserver（如 ScrollExitWrapper）。详见 `docs/display-issue-summary.md`。
- 保持 `globals.css` 中的 CSS 变量命名规范，便于主题统一管理。
