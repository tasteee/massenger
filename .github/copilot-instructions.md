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

- NEVER DESTRUCTURE FUNCTION PARAMETERS OR COMPONENT PROPS. Always use dot
  notation to access data within objects passed as parameters or props. This ensures that all data access is explicit and clear, improving readability and maintainability.

- NEVER DECLARE COMPLEX TYPES FOR FUNCTION PARAMETERS IN THE FUNCTION DECLARATION.
  Instead, declare complex types separately and use them as needed. This keeps function signatures clean and focused on the function's purpose, while still providing strong typing and clarity about the data being used.

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

// If it can be a single line, it must be a single line.
if (fetchError) return handleError(fetchError)
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

- Never use default exports. Always used named exports.

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
- Default exports

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

- ❌ No default exports

- ❌ No shorthand syntax

- ❌ No nested control flow

- ❌ No `try/catch` for promises

- ✅ Functional programming only

- ✅ Explicit returns

- ✅ Early returns

- ✅ `await-to-js` for async

- ✅ `type` only

- ✅ Arrow functions

---

# "datass" npm package documentation:

🦇 React stores. Local and global. DX foxused API. TypeScript first. Simple as hell. Capable as fuck.

```
npm add datass
```

## Let's do it.

### Global Stores

```ts
const $num = datass.number(100)

$num.set(200)
$num.state // 200
$num.set.add(50)
$num.state // 250
$num.set.subtract(25)
$num.state // 225
$num.set.reset()
$num.state // 100
$num.use() // 100
$num.use((state) => state * 10) // 1000

const $str = datass.string('foo')

$str.set('bar')
$str.state // 'bar'
$str.set.reset()
$str.state // 'foo'
$str.use() // 'foo'
$str.use((state) => state.toUpperCase()) // 'FOO'

const $bool = datass.boolean(true)

$bool.set(false)
$bool.state // false
$bool.toggle()
$bool.state // true
$bool.set.reset()
$bool.state // true
$bool.use() // true
$bool.use((state) => typeof value) // 'boolean'

const $arr = datass.array<number>([0, 1, 2])

$arr.set([10, 11, 12])
$arr.state // [10, 11, 12]
$arr.set.append(13)
$arr.state // [10, 11, 12, 13]
$arr.set.prepend(9)
$arr.state // [9, 10, 11, 12, 13]
$arr.set.append(1, 2) // append or prepend multiple
$arr.state // [9, 10, 11, 12, 13, 1, 2]
$arr.set.reset()
$arr.state // [0, 1, 2]
$arr.set.lookup(3, 3) // state[3] = 3
$arr.use() // [0, 1, 2, 3]
$arr.use((state) => state.reverse()[0]) // 2
$arr.use.find((value) => value > 1) // 2
$arr.use.filter((value) => value > 0) // [1, 2]
$arr.use.map((arr) => arr > 0) // [false, true, true]

type MyObjectT = { name: string; age?: number; numbers?: number[] }
const $obj = datass.object<MyObjectT>({ name: 'tasteink' })

// NOTE: For object stores, builds the next state
// by merging the object you provide into the existing
// state object. To fully replace the existing state,
// reach for `yourStore.set.replace({ ... })`

$obj.set({ age: 123 })
$obj.set.reset()
$obj.set.replace({ name: 'rokki', numbers: [0, 1, 2] })
$obj.set.lookup('name', 'tasteink')
$obj.set.lookup('numbers.2', 99)
$obj.use() // { name: 'tasteink', numbers: [0, 1, 99 ]}
$obj.use((state) => state.name) // 'tasteink'
$obj.use.lookup('name') // 'tasteink'
$obj.use.lookup('numbers.2') // 99
```

### Local Stores

```ts
import { useDatass } from 'datass'

const Component = () => {
	const num = useDatass.number(250)
	const str = useDatass.string('hello')
	const bool = useDatass.boolean(false)
	const arr = useDatass.array([0, 99, 122])
	const obj = useDatass.object({ foo: 'bar' })

	// These stores have the exact same APIs
	// except you do not .use() them.
	const handleSomething = () => {
		num.set(120)
		num.add(10)
		num.state // 130
		str.set(str.state.toUpperCase())
		str.state // 'HELLO'
		bool.toggle()
		bool.state // true
		arr.set.append(222)
		arr.set.prepend(123)
		arr.set.lookup('1', 55)
		arr.state // [123, 55, 99, 122, 222]
		obj.set({ ...etc }) // it is all the same!
	}
}
```

# 🤍 Hey, real quick...

🙏🤍🖤 I have almost a decade of experience in software, but my career, and subsequently my life, came crashing down when I was laid off in 2023 and fell into the recently-collapsed software job market. I am struggling quite a bit to survive right now.

# [Please pleaseee help if you can.](https://cash.app/$rokkiiii) 🤍🤍🤍

## Immer-powered Object Store Updates

```tsx
const $user = datass.object({
	name: 'Brooklyn',
	age: 30,
	skills: ['JavaScript', 'React']
})

$user.set.by((draft) => {
	draft.name = draft.name.toUpperCase()
	draft.age += 1
	draft.skills.push('datass')
})
```

## Async Updates

```tsx
const $users = datass.array([])

// Load users asynchronously:
async function fetchUsers() {
	await $users.set.byAsync(async () => {
		const response = await fetch('https://api.example.com/users')
		const data = await response.json()
		return data // Directly return new state
	})
}
```

### Middleware

#### Custom Middleware

```tsx
// Create a logging middleware:
const loggingMiddleware = (store) => {
	const originalSet = store.set

	store.set = (...args) => {
		console.log(`Setting store state`, args)
		return originalSet(...args)
	}

	return store
}

// Apply middleware:
const ss = datass.withMiddleware(loggingMiddleware)
const $settings = ss.object({ theme: 'light', notifications: true })
```

#### undoRedo middleware

```ts
import { datass } from 'datass'

const undoRedoMiddleware = datass.middleware.undoRedo({ maxHistory: 50 })
const enhancedDatass = datass.withMiddleware(undoRedoMiddleware)
const $myStore = enhancedDatass.array([0, 5, 10])
$myStore.set.append(15)
$myStore.set.undo()
$myStore.set.redo()
```
