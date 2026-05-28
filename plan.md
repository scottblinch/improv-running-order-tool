# Implementation Plan

How we built it. Behavior and data rules: [`spec.md`](spec.md).

## Architecture

```
App → AppShell → RosterPanel | RunningOrderPanel
         ↑ layout/     ↑ roster/  ↑ running-order/
shared/, ui/, dnd/, theme/, store/, lib/, hooks/, pwa/
```

No barrel `index.ts` files. UI strings: `src/locales/en.json`. Code folder `running-order/` = UI **Lineup**.

| Layer          | Path                           |
| -------------- | ------------------------------ |
| ui             | shadcn/Radix primitives        |
| layout         | shell, header, footer, dialogs |
| shared         | EmptyState, CastSlot, forms    |
| roster/        | roster panel                   |
| running-order/ | lineup panel                   |
| store/         | Zustand + persist              |
| lib/           | share, print, dates, a11y      |

## Status (all MVP steps done)

| Step  | Description                                                                               |
| ----- | ----------------------------------------------------------------------------------------- |
| 1–9   | Scaffold → design system → store → layout → roster/scenes → DnD → mobile → print → polish |
| 10–12 | Show metadata → multi-show → all play                                                     |
| 13–15 | Print preview → i18n → input security                                                     |
| 16–20 | Footer → share → PWA → privacy → toasts                                                   |
| 21–27 | Tooltips → rename → a11y → axe → eslint → husky → DRY helpers                             |
| 28–32 | Show details (venue/time) → deploy CI → empty workspace → duplicate → delete last         |
| 33–36 | Icons/branding → PWA refresh → mobile collapsibles → launch hardening                     |

## Post-MVP

- [ ] Export / import JSON
- [ ] Back-to-back cast warning
- [ ] Additional locales

## References

- [`spec.md`](spec.md)
- [`README.md`](README.md)
