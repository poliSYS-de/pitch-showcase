# Display Issue Summary

本文档简述历史上出现的桌面端内容不显示问题、根因与当前解决方案。完整技术规范与最佳实践见 [Ultimate Developer Guide](./ultimate-develop-guide.md)。

---

## 问题现象（历史）

- **Mobile**：显示与动画正常。
- **Desktop (>768px)**：仅背景/粒子或部分标题可见，主体内容与进场动画缺失。
- **ClosingSlide** 正常，其他 slide 大量不可见或无动画。

## 根因分析

- **核心原因**：Framer Motion 的 `useScroll` 与 Lenis 存在兼容性问题。Lenis 管理自己的滚动状态与动画循环，`useScroll` 依赖原生 `window.scrollY`/文档滚动，二者不同步，导致 `scrollYProgress` 在桌面端返回错误值（初始化或滚动过程中），进而使绑定在 opacity/scale 上的动画在内容应可见时错误地显示为透明或缩小。
- 桌面端若用 `scrollYProgress` 驱动 opacity/scale，会导致进入视口时内容仍不可见。
- 若 slide 内 `useInView` 的 ref 未放在最外层内容容器，或 amount 过严，也会导致触发不稳定。

## 解决方案（当前采用）

- **ScrollExitWrapper**：不再使用 `useScroll` 驱动 opacity/scale/y，改为 **IntersectionObserver** 根据元素可见比例（intersectionRatio）计算并更新 `useMotionValue`。可见性基于实际 DOM 与视口关系，与 Lenis 无关，内容可正确显示。
- **淡出逻辑**：当仅剩约 40% 内容可见时开始淡出（ratio < 0.4），实现可控的退出动画。
- **Slide 内进场**：每个 slide 使用**外层 `div ref={ref}`** 作为 `useInView(ref, { once: false, amount: 0.5 })` 的观察目标，内容放在 `ScrollExitWrapper` 内；飞入使用统一 `ease: [0.16, 1, 0.3, 1]` 与明确 initial 值。
- **SlideWrapper**：`useInView(ref, { once: true, amount: 0 })`，任何像素进入视口即触发 slide 进场。

## 当前站点 Slide 与一致性

以下 slide 均已按上述模式实现（飞入 + 退场 + 可选重复触发）：

| Slide | 文件 | 说明 |
|-------|------|------|
| Hero | HeroSlide | GSAP 字母 + Motion，离场时 GSAP reset |
| Company | CompanySlide | AnimatedText + 对称飞入，key 控制重入 |
| Vision | VisionSlide | 左/右栏飞入 + stagger |
| Product | ProductSlide | 三列卡片 scale + 产品卡片 stagger |
| Visuals | VisualsSlide | 双图 scale 飞入 |
| Features | FeaturesSlide | 四宫格 + Vibe 区块 + stats |
| LFM | LFMSlide | GSAP 柱状图/连线，离场时 GSAP reset |
| Go-To-Market | GoToMarketSlide | 渠道卡片 + Timeline |
| Finance | FinanceSlide | GSAP 曲线/圆点，离场时 GSAP reset |
| The Ask | AskSlide | 金额 + Term + Use of funds + Milestones |
| Closing | ClosingSlide | 收尾页 |

## 如何确保不再复发

- **禁止**：用 `useScroll` / `scrollYProgress` 驱动 opacity 或 scale。与 Lenis 联用时 scroll 进度不可靠，会遮蔽内容。
- **推荐**：基于滚动的可见性/退场一律用 IntersectionObserver（如 ScrollExitWrapper）或 Lenis 自身 API 驱动。
- Slide 内进场：`useInView(ref, { amount: 0.5 })`，ref 指向 slide 最外层内容容器；需要**重复触发**时使用 `once: false` 并对所有 motion 元素在 `!isInView` 时赋予与 initial 一致的隐藏状态（及 GSAP 离场 reset）。
- 新增或修改 slide 后，在 Desktop 与 Mobile 各做一次完整浏览验证。

## 如何确保 Desktop / Mobile 都正常

- **Mobile**：ScrollExitWrapper 返回普通 div，无退场特效；SlideWrapper 使用简化 fade up。
- **Desktop**：ScrollExitWrapper 使用 IntersectionObserver 驱动 fade/scale/y，内容可见且退场明显；Slide 内 useInView 使用 amount: 0.5，ref 在外层容器上。
