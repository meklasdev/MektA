# MektA Studio — Design System

## Brand mood

MektA Studio is a quiet, precise workspace for developers and technical creators. The interface should feel closer to a well-made editor than a marketing dashboard: monochrome surfaces, high typographic contrast, one restrained blue action color, and motion only when it explains a state change.

## Tokens

```css
:root {
  --color-bg: #0b0c0e;
  --color-surface: #121417;
  --color-surface-raised: #181b20;
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-border: #24272c;
  --color-border-strong: #343942;
  --color-accent: #2563eb;
  --color-accent-hover: #3b82f6;
  --color-success: #a1a1aa;
}
```

Type scale: display 32/38 600, heading 24/30 600, subheading 16/24 600, body 14/22 400, label 12/18 500, caption 11/16 400. Use Inter, Geist or the platform sans stack. Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 64. Elevation is expressed through surface contrast and a single-pixel border; avoid decorative shadows.

## Layout rules

- Persistent sidebar: 240px expanded, 68px collapsed.
- Top bar: 72px, one title context and one primary action.
- Main content max width: 1152px, 24px minimum page padding.
- Cards use 8px radius, 16–24px internal padding and no gradients.
- The only vivid color is `--color-accent`, reserved for primary actions, selected navigation, focus rings and critical runtime state.

## Component contract

```tsx
export function Button({ children, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
    quiet: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
  };
  return <button className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium transition ${styles[variant]}`} {...props}>{children}</button>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-zinc-800 bg-zinc-900 p-5 ${className}`}>{children}</section>;
}
```

## Future feature rules

1. Every new feature must have one primary action; secondary actions stay quiet.
2. Do not add a new color for a new category. Use labels, icons and surface contrast.
3. Never add a card solely for decoration; each card must answer one user question.
4. Keep default screens scannable in under five seconds: title, state, next action.
5. Add motion only for navigation, loading, success, or destructive confirmation.
