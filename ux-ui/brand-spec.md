# E-Commerce — Brand & Design Spec

Bound from `system-ui-design.md` (§2 tokens, §2.4 a11y) and `system-design.md` (§5 component tree). Source of truth for the locked design system.

## Tokens (OKLch)

Dark-mode overrides apply when `ui.theme = 'dark'` (persisted in `localStorage`; first load follows `prefers-color-scheme`).

| Seed token | Light | Dark | Usage |
|---|---|---|---|
| `--bg` | oklch(1 0 89.9) · #FFFFFF | oklch(0.1408 0.0044 285.8) · #09090B | Page background |
| `--surface` | oklch(1 0 89.9) · #FFFFFF | oklch(0.2103 0.0059 285.9) · #18181B | Cards, modals, raised surfaces |
| `--fg` | oklch(0.1408 0.0044 285.8) · #09090B | oklch(0.9851 0 89.9) · #FAFAFA | Default text |
| `--muted` | oklch(0.5517 0.0138 285.9) · #71717A | oklch(0.7118 0.0129 286.1) · #A1A1AA | Secondary text, placeholders |
| `--border` | oklch(0.9197 0.004 286.3) · #E4E4E7 | oklch(0.2739 0.0055 286) · #27272A | Inputs, rows, card hairlines |
| `--accent` (interaction) | oklch(0.2103 0.0059 285.9) · #18181B | oklch(0.9851 0 89.9) · #FAFAFA | Primary buttons, active nav, links — inverts |

Documented extensions: `--on-accent` #FAFAFA / #18181B (text on primary); `--hover-fill` #F4F4F5 / #18181B (secondary, badges, zebra). Semantic set, light → dark (raised luminance): success #16A34A / #22C55E · warning #CA8A04 / #FACC15 · info #2563EB / #3B82F6 · destructive #DC2626 / #EF4444.

## Fonts

- Display (serif): Iowan Old Style, Charter, Georgia, Times New Roman, serif
- Body (sans): -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif
- Mono (numerics, captions, eyebrows): ui-monospace, JetBrains Mono, SF Mono, Menlo, monospace

## Observed rules

1. **Neutral zinc-first palette.** The brand accent *is* the primary: near-black controls in light mode invert to near-white in dark. Status colors stay scoped inside their badge components.
2. **Theme is a first-class state.** Light default; first load follows `prefers-color-scheme`; persisted in `ui.theme` / `localStorage`. Dark inverts bg / fg / primary wholesale.
3. **Compact type ramp** (Display 36–48 → Small 12) with a hard legibility rule: purchase-relevant numbers (price, rating) never drop below the 14px Body tier. `Small` = captions, timestamps, badges only.
4. **Geometry.** 4px spacing grid (4·8·12·16·24·32·48); radius sm 6 / md 8 / lg 12 / full; max content 1280px centered; header 64px (56px mobile, sticky); admin sidebar 240px (slide-over ≤768px); product thumbnail 200×200, 1:1.
5. **Accessibility contract.** Hit targets ≥ 44px; visible `:focus-visible` ring on every control; hover/focus/selected flip bg+fg together and never drop below 4.5:1 (text) / 3:1 (icons); status = color chip + text label — color is never the only signal; disabled is the only state allowed to lower contrast.