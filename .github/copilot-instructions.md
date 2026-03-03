# DESIGN and UI / UX INSTRUCTIONS:

When developing this app, provide proper consideration as though
you are a top-tier, award winning UX designer and product strategist
-- the caliber of designer hired by Apple, Vercel, Figma, or Stripe.
Your UX choices should be clean, minimal, ultra-modern, very intuitive,
highly user-friendly, visually polished and cohesive with attention to
typography, spacing, color palette, micro-interactions, visual heirarchy,
and animations / transitions to provide a delightful user experience.
Your work should be inspired by the design language of high-profile tech companies.
Include interaction details: hover states, transitions, micro-interactions.
The tone should be thoughtful, professional, creative, and very high-end,
expensive feeling even.

1. The Surface Strategy (Chromatic Depth)

The UI rejects traditional "skeuomorphic" shadows in favor of a Layered Flat aesthetic. Hierarchy is established through a three-tier grayscale system:

Level 0 (The Void): Pure Black (#000000) used as the global canvas background.

Level 1 (The Bed): Deep Charcoal (#0c0c0c) for structural containers like the sidebar and the right-hand utility panels.

Level 2 (The Interactive): Mid-Charcoal (#1a1a1a) for individual feed cards and project items.

Level 3 (The Focus): Subtle borders (#2a2a2a) act as the "cut" that separates Level 2 from Level 1, ensuring definition without visual weight.

2. Interaction & Hover States (Snappy Precision)

Interactions are designed to feel "tight" and high-performance:

Button Logic: High-contrast CTAs (like the Red "Create" or Yellow "Get") use solid fills with no gradients.

Hover Transitions: Interactive elements (sidebar items, feed cards) should utilize a 0.2s transition. On hover, background colors should shift one tier up (e.g., #0c0c0c becomes #1a1a1a) rather than glowing.

Active States: Nav items are highlighted by a subtle background fill (#262626) and a white font-weight increase, rather than an accent bar.

3. Spatial System & Geometry

The "Soft Edge" Philosophy: Every primary container uses a 12px to 16px border-radius. CTAs use a full "Pill" (rounded-full) shape to distinguish action from information.

Dense but Breathable: The layout uses a standard 24px gutter between major columns, but internal card padding is tightened to 20px to keep the content feeling "pro" and information-dense.

Vertical Rhythm: A three-column grid (Sidebar ~240px, Main Feed Flexible, Right Rail ~320px).

4. Typography & Information Architecture

Font: A clean, geometric Sans-Serif (BandLab Sans).

Hierarchy:

Primary: Pure White (#ffffff) for headlines and active states.

Secondary: Cool Gray (#9ca3af) for body text.

Muted: Dim Gray (#6b7280) for metadata like timestamps or follower counts.

Action Links: Blue (#3b82f6) is used sparingly, ensuring it "pops" against the monochrome base.

5. Visual "Pops" (Functional Color)

Signal Red: Used exclusively for high-priority creative triggers ("Create").

Trophy Orange: Reserved for premium "Plus" features or gamified elements.

Electric Purple: Used as a digital "spark" for new posts or lightning-fast interactions.

# DEVELOPMENT AND CODE STYLE INSTRUCTIONS:

## 1. Programming Paradigm

- **Always write functional code.**
- **Object-oriented programming is forbidden.**
- **Never use classes.**
- Use **factory functions** instead of classes when object creation is required.

---

## 2. Functions

- Prefer **small, pure, reusable, and composable functions**.
- Prefer **arrow functions** over `function` declarations.
- **Never rely on implicit returns.**
  - Arrow functions **must always use braces**.
  - Arrow functions **must always include an explicit `return` statement**.

- Functions must do **one thing only** and return early when possible.

---

## 3. Control Flow

- **Avoid nesting blocks at all costs.**
- Flatten logic using **early returns**.
- Prefer **single-line `if` statements** for simple conditions.
- Do **not** wrap control flow in unnecessary blocks.
- Explicit logic is always preferred over compact or clever logic.

---

## 4. Error Handling & Async Code

- **Never use `try/catch` for promises.**
- Use **`await-to-js`** for async error handling.

### Required Pattern

```ts
const [fetchError, fetchResult] = await to(fetchPromise)

if (fetchError) {
	return handleError(fetchError)
}
```

- Errors must be handled immediately.
- Always return early after an error.
- Never allow execution to continue after an error.

---

## 5. TypeScript Rules

- **Always use `type`.**
- **Never use `interface`.**
- Prefer **type aliases** for:
  - Objects
  - Unions
  - Intersections

- All types must be explicit and descriptive.

---

## 6. Variables & Naming

- **Never abbreviate variable names.**
- Use **fully descriptive, readable names**.
- Variable names must clearly communicate intent.
- Avoid single-letter or shortened identifiers.

---

## 7. Syntax Rules

- **Never use shorthand syntax.**
- Always use **explicit syntax**, even when verbose.
- Explicit code is always preferred over implicit behavior.

### Examples of Forbidden Patterns

- Implicit returns
- Ternaries used for logic flow
- Short-hand object properties
- Compact or clever syntax that reduces readability

---

## 8. General Principles

- **Explicit is better than implicit.**
- **Readability beats brevity.**
- **Predictability beats cleverness.**
- Generated code must be easy to understand, modify, and debug.

---

## 9. Non-Negotiable Rules Summary

- ❌ No classes

- ❌ No OOP

- ❌ No implicit returns

- ❌ No interfaces

- ❌ No abbreviated names

- ❌ No shorthand syntax

- ❌ No nested control flow

- ❌ No `try/catch` for promises

- ✅ Functional programming only

- ✅ Explicit returns

- ✅ Early returns

- ✅ `await-to-js` for async

- ✅ `type` only

- ✅ Arrow functions
