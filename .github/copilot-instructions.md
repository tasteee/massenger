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

# DEVELOPMENT AND CODE STYLE INSTRUCTIONS:

## 1. Programming Paradigm

* **Always write functional code.**
* **Object-oriented programming is forbidden.**
* **Never use classes.**
* Use **factory functions** instead of classes when object creation is required.

---

## 2. Functions

* Prefer **small, pure, reusable, and composable functions**.
* Prefer **arrow functions** over `function` declarations.
* **Never rely on implicit returns.**

  * Arrow functions **must always use braces**.
  * Arrow functions **must always include an explicit `return` statement**.
* Functions must do **one thing only** and return early when possible.

---

## 3. Control Flow

* **Avoid nesting blocks at all costs.**
* Flatten logic using **early returns**.
* Prefer **single-line `if` statements** for simple conditions.
* Do **not** wrap control flow in unnecessary blocks.
* Explicit logic is always preferred over compact or clever logic.

---

## 4. Error Handling & Async Code

* **Never use `try/catch` for promises.**
* Use **`await-to-js`** for async error handling.

### Required Pattern

```ts
const [fetchError, fetchResult] = await to(fetchPromise)

if (fetchError) {
  return handleError(fetchError)
}
```

* Errors must be handled immediately.
* Always return early after an error.
* Never allow execution to continue after an error.

---

## 5. TypeScript Rules

* **Always use `type`.**
* **Never use `interface`.**
* Prefer **type aliases** for:

  * Objects
  * Unions
  * Intersections
* All types must be explicit and descriptive.

---

## 6. Variables & Naming

* **Never abbreviate variable names.**
* Use **fully descriptive, readable names**.
* Variable names must clearly communicate intent.
* Avoid single-letter or shortened identifiers.

---

## 7. Syntax Rules

* **Never use shorthand syntax.**
* Always use **explicit syntax**, even when verbose.
* Explicit code is always preferred over implicit behavior.

### Examples of Forbidden Patterns

* Implicit returns
* Ternaries used for logic flow
* Short-hand object properties
* Compact or clever syntax that reduces readability

---

## 8. General Principles

* **Explicit is better than implicit.**
* **Readability beats brevity.**
* **Predictability beats cleverness.**
* Generated code must be easy to understand, modify, and debug.

---

## 9. Non-Negotiable Rules Summary

* ❌ No classes

* ❌ No OOP

* ❌ No implicit returns

* ❌ No interfaces

* ❌ No abbreviated names

* ❌ No shorthand syntax

* ❌ No nested control flow

* ❌ No `try/catch` for promises

* ✅ Functional programming only

* ✅ Explicit returns

* ✅ Early returns

* ✅ `await-to-js` for async

* ✅ `type` only

* ✅ Arrow functions
