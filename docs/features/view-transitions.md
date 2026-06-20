# View transitions

Page navigations use the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) via [`next-view-transitions`](https://github.com/shuding/next-view-transitions).

## How it works

- `AppViewTransitions` wraps the web layout in `app/(web)/layout.tsx`
- Internal `<Link>` navigations trigger a subtle cross-fade (200ms)
- Browsers without support render normally — no polyfill needed

## CSS

Transition styles live in `app/globals.css` under `@supports (view-transition-name: none)`.

To customize, edit the `::view-transition-old(root)` and `::view-transition-new(root)` rules.

## Reduced motion

Users with `prefers-reduced-motion: reduce` still get instant navigations. Lenis smooth scroll is also disabled in that case.

Media parallax (`ParallaxWrapper`) is disabled under reduced motion as well — see [media.md](media.md).
