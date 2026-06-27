# Codex Implementation Plan

Validated against the current checkout in `C:\Users\saadm\Desktop\bio info project\bioinfo-project` on 2026-04-20.

Project context:
- Framework: Next.js 16, React 19, TypeScript, Framer Motion, Tailwind CSS v4
- Home page: `src/app/page.tsx`
- Active algorithms page: `src/app/algorithms1/page.tsx`
- Shared stylesheet: `src/app/globals.css`
- Tailwind config: `tailwind.config.js`

## Current Baseline

These notes are based on the current code, not assumptions:

- `src/app/page.tsx` still uses Framer Motion stagger/fade variants for the hero text and the logo row.
- `src/app/algorithms1/page.tsx` is a large client component with inline subcomponents.
- `src/app/algorithms1/page.tsx` currently contains about 1645 lines and is 72,525 bytes on disk.
- `src/app/algorithms1/page.tsx` currently contains 31 `backdrop-blur` matches, not 18.
- The algorithms page still uses `AnimatePresence` with `height: 0 -> auto` for the inner animation section.
- Lint currently fails on an existing hook issue at `src/app/algorithms1/page.tsx:531-536` because `setScoring` is called synchronously inside an effect.
- `next build` passes in the current checkout.
- Next.js warns about multiple lockfiles and infers a workspace root above this project.

Implication:
- Do not treat this file as a pure feature wishlist. We need a small correctness pass before or alongside the bigger UX and performance changes.

## Task 1: Sequential Typewriter Effect on the Hero

### Goal

Replace the current staggered reveal of the hero text stack in `src/app/page.tsx` with a sequential typewriter effect:

1. `Gene Analysis`
2. `For researchers and`
3. `students`
4. `exploring DNA`
5. `alignment`

The existing layout, fonts, spacing, and adjacent media should remain intact.

### Safer Implementation Approach

Create `src/lib/hooks/useTypewriter.ts` with a timeout-driven sequence rather than a raw interval:

- API: `useTypewriter(lines, options) -> { revealedLines, activeLine, done }`
- Options:
  - `charDelay`: default `38`
  - `lineDelay`: default `180`
- Use `useReducedMotion()` from `framer-motion`.
- On reduced motion, return all lines immediately and mark `done: true`.
- Use a single timeout chain with cleanup on unmount.

Why timeout over interval:
- Easier to model character pauses plus line pauses.
- Less drift-prone.
- Simpler cleanup when the active line changes.

### Page Integration Notes

In `src/app/page.tsx`:

- Replace the hero text stack animation wrappers with plain layout containers or very light motion wrappers where still useful.
- Keep the pill image animation if it already works well.
- Only the text should type; the image should still render immediately.
- The "Who are we?" button must not be merely invisible.

For the "Who are we?" button:
- Prefer conditional rendering after the `students` line finishes.
- If opacity animation is used, also apply `visibility: hidden`, `aria-hidden="true"`, and `tabIndex={-1}` until visible.
- Do not rely on `opacity: 0` plus `pointer-events: none` alone, because that can still leave the button in keyboard focus order.

### Accessibility Requirements

Do not replace real semantics with a wrapper `aria-label`.

Preferred pattern:
- Keep visible typed text `aria-hidden="true"`.
- Add equivalent static screen-reader-only content with real semantic structure.
- Preserve a true `h1` for the hero heading.

Example approach:
- Visible animated row: `aria-hidden="true"`
- Separate `sr-only` heading and supporting text for screen readers

### CSS Additions

Add the cursor styling in `src/app/globals.css`:

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.typewriter-cursor {
  animation: blink 0.8s step-start infinite;
}

@media (prefers-reduced-motion: reduce) {
  .typewriter-cursor {
    animation: none;
  }
}
```

### Acceptance Criteria

- The five lines type in order.
- The existing layout does not shift unexpectedly.
- The pill image still appears immediately.
- The "Who are we?" button only becomes visible and focusable after the `students` line completes.
- Reduced motion shows all text immediately with no blinking cursor.
- Screen readers still get a proper heading and full hero message immediately.

## Task 2: Infinite Logo Marquee

### Goal

Replace the current logo stagger/fade sequence in `src/app/page.tsx` with an infinite marquee that:

- scrolls continuously from right to left
- pauses on hover
- soft-fades at the edges
- respects reduced motion

### Safer Implementation Approach

Implement the marquee with plain CSS in `src/app/globals.css` rather than adding one-off animation utilities to `tailwind.config.js`.

Why:
- Fewer moving parts for a single animation.
- Easier to tune in one place.
- Avoids config churn for a localized effect.

### Important Seam Detail

Do not assume a single flex row with `gap` plus `translateX(-50%)` will always be seamless.

Safer pattern:
- Build two identical logo groups.
- Put spacing inside each repeated group, not as an outer track gap that changes the math.
- Animate the full track by exactly one group width.

If we keep a `-50%` transform approach:
- ensure the duplicated content occupies exactly half of the track width
- avoid introducing extra inter-copy spacing on the outer track

### Suggested Structure

In `src/app/page.tsx`:

```tsx
<div className="logo-marquee-wrapper overflow-hidden relative">
  <div className="logo-marquee-track">
    <div className="logo-marquee-group">
      {/* 4 logos */}
    </div>
    <div className="logo-marquee-group" aria-hidden="true">
      {/* same 4 logos */}
    </div>
  </div>
</div>
```

In `src/app/globals.css`:
- add `@keyframes marquee`
- add `.logo-marquee-track`
- add `.logo-marquee-group`
- add the edge mask with both `mask-image` and `-webkit-mask-image`
- disable the animation in reduced motion

### Acceptance Criteria

- The marquee loops without a visible jump.
- Hover pauses the movement.
- Edge fade works in Chromium and Safari.
- Reduced motion disables scrolling and leaves logos statically visible.
- The layout still looks balanced across breakpoints.

## Task 3: Algorithms Page Correctness, Maintainability, and Performance

### What Is Actually Wrong Today

Before broad optimization, fix the known correctness and maintainability issues:

1. Existing lint error:
   - `src/app/algorithms1/page.tsx:531-536`
   - `setScoring(...)` is called inside an effect tied to `algorithm`

2. Large inline page composition:
   - the file contains multiple inline "Glass*" components
   - this makes review, testing, and bundle strategy harder

3. Height animation on the inner animation panel:
   - current implementation uses `height: 0 -> auto`
   - that can cause layout work during the transition

4. Per-keystroke synchronous validation:
   - sequence and mutation inputs validate immediately on every change

5. Blur-heavy visual stack:
   - there are many blurred surfaces and nested glass elements
   - some may be redundant, but we should verify visually before stripping them

### Senior-Engineer Guardrails

- Do not infer shipped bundle size from source-file byte size.
- Do not use `dynamic(..., { ssr: false })` by default for primary above-the-fold UI.
- Do not add `React.memo` and `useCallback` everywhere blindly.
- Do not remove blur layers without screenshot-based QA.

### Recommended Implementation Order for This Page

#### Phase 3A: Fix Existing Correctness Issues First

Address the current `setScoring` effect problem before bigger refactors.

Preferred options:
- derive default scoring from `algorithm` at initialization and reset through explicit user actions
- or remount the relevant input component with a `key={selectedAlgorithm}` so the local state reinitializes naturally

Avoid:
- keeping a sync effect that writes state every time the algorithm prop changes

Also clean up existing `<img>` warnings in this file where practical by using `next/image` when appropriate.

#### Phase 3B: Extract Inline Components

Move the major inline pieces out of `src/app/algorithms1/page.tsx`:

- `GlassSequenceInput`
- `GlassMutationInput`
- `GlassAnimationControls`
- `GlassAlignmentDisplay`
- `GlassMutationDisplay`
- `GlassInfoCard`
- `GlassAlgorithmTabs`

Suggested directory:

```txt
src/components/algorithms/
```

Benefits:
- smaller review surface
- easier profiling
- easier targeted memoization
- easier testing

#### Phase 3C: Apply Targeted Splitting

After extraction, consider dynamic imports only for heavy or post-interaction sections:

- likely candidates:
  - `GlassAnimationControls`
  - `GlassAlignmentDisplay`
  - `GlassMutationDisplay`
  - possibly matrix/graph visualizations

Keep first-render critical UI as regular imports unless measurement shows a real benefit.

If dynamic imports are used:
- prefer preserving SSR by default
- add lightweight loading placeholders
- verify there is no hydration flash or delayed first interaction

#### Phase 3D: Debounce Validation Carefully

Debounce validation in the extracted input components, but do it per field.

Requirements:
- separate timer refs for each independently validated field
- immediate controlled input updates
- delayed validation updates
- timeout cleanup on unmount

This avoids:
- one field canceling another field's validation timer
- laggy text input behavior

#### Phase 3E: Replace the Inner Height Animation

Rework the inner "Show Animation" panel transition now at `src/app/algorithms1/page.tsx:337-345`.

Safer choices:
- CSS `max-height` transition with overflow hidden
- or CSS grid row transition

Keep the outer results enter/exit motion if it still feels good and performs acceptably.

#### Phase 3F: Audit Backdrop Blur

Do a visual audit after extraction.

Approach:
- count top-level glass surfaces
- identify nested child elements that blur the same backdrop again
- remove only the obviously redundant child blur layers
- compare before/after screenshots, especially on the results area and animation section

Do not hard-code a target like "reduce to 6". Use visual QA plus browser profiling.

### Acceptance Criteria

- The existing lint error is fixed.
- The algorithms page builds and behaves the same functionally after extraction.
- Input typing feels responsive.
- Validation feedback remains clear.
- The animation panel opens and closes smoothly.
- Any blur reduction preserves the intended glass look.
- Any code-splitting change is backed by actual load/perf improvement, not theory alone.

## Implementation Plan

Recommended order across the whole project:

### Phase 0: Baseline and Guardrails

- Fix the existing lint blocker on `src/app/algorithms1/page.tsx`
- Capture a baseline:
  - `npm run build`
  - `npm run lint`
  - quick visual QA on `/` and `/algorithms1`
- If needed, note the current Next.js multiple-lockfile warning for follow-up

### Phase 1: Hero Typewriter

- Add `useTypewriter`
- Update the hero text stack
- Add accessible static equivalents
- Ensure the "Who are we?" button is not focusable before it is shown

Risk: low

### Phase 2: Logo Marquee

- Replace the current logo animation with a CSS marquee
- Add hover pause and reduced-motion fallback
- Verify the loop seam carefully

Risk: low to medium

### Phase 3: Algorithms Correctness Cleanup

- Remove the `setScoring` effect issue
- Clean up easy warnings that are directly in scope
- Keep behavior stable

Risk: medium

### Phase 4: Algorithms Extraction and Performance Pass

- Extract the inline Glass components
- Apply targeted dynamic imports only where justified
- Debounce validation per field
- Replace the inner height animation
- Audit nested blur layers

Risk: medium to high

### Phase 5: QA and Deployment Readiness

- Run `npm run build`
- Run `npm run lint`
- Verify reduced-motion behavior
- Verify keyboard navigation and focus order
- Compare perceived load and interaction performance before and after

Deployment note:
- Do not assume Vercel auth state in this document.
- Do not auto-deploy as part of implementation unless explicitly requested.

## Verification Checklist

- [ ] Home hero types in the correct order
- [ ] Cursor blinks only while typing
- [ ] Reduced-motion users see all hero text immediately
- [ ] The "Who are we?" button is not visible or focusable before it should appear
- [ ] Logo marquee loops without a visible seam
- [ ] Logo marquee pauses on hover
- [ ] Logo marquee disables motion in reduced-motion mode
- [ ] Existing lint error on the algorithms page is fixed
- [ ] Algorithms page still works for Needleman-Wunsch, Smith-Waterman, and BFS mutation flows
- [ ] Validation remains understandable after debouncing
- [ ] The inner animation section expands/collapses smoothly
- [ ] Any dynamic import keeps initial UX acceptable
- [ ] `npm run build` passes
- [ ] `npm run lint` passes, or any remaining issue is explicitly documented and accepted

## Non-Goals

Unless explicitly requested, this plan does not include:

- redesigning the home page layout
- redesigning the algorithms page visual system
- changing copywriting beyond what is needed for accessibility
- automatic deployment commands
