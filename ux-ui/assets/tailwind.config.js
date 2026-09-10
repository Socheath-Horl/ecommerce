/* ────────────────────────────────────────────────────────────────
   Horizon Supply Co. — shared Tailwind config (static HTML build)
   Load this AFTER https://cdn.tailwindcss.com in every page.
   Maps Tailwind's shadcn/ui utility names onto the brand tokens
   from assets/tokens.css so markup reads like a shadcn project:
     bg-background · text-foreground · bg-primary · border-border
     rounded-md = 10px (buttons/inputs) · rounded-lg = 16px (cards)
   Opacity modifiers (bg-primary/10, ring-primary/15, ...) work on
   the oklch variables via color-mix (Tailwind >= 3.4).
   ──────────────────────────────────────────────────────────────── */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        serif: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        md: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'calc(var(--radius-lg) + 4px)',
      },
      boxShadow: {
        soft: '0 1px 2px color-mix(in oklch, var(--foreground) 8%, transparent), ' +
          '0 16px 40px -18px color-mix(in oklch, var(--foreground) 14%, transparent)',
      },
    },
  },
}