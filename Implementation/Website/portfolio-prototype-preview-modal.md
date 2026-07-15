# Prototype Preview Modal Implementation Plan

The goal is to modify the portfolio component so that clicking "View Prototype" opens the interactive prototype in an elegant modal (popup) with an iframe on the same page, instead of redirecting the user to a new browser tab.

## Responsive Design Requirements

- **Mobile Viewports**: Shows the preview modal in a fullscreen sheet overlay (removing double scrolling issues and providing a native app feel on small screens).
- **Tablet/Desktop Viewports**: Shows the preview inside a premium, glassmorphic card modal (`max-w-6xl` width and `85vh` height) centered on the screen.
- **Loading State Indicator**: Display a premium animated spinner with an indicator while the target viewport establishes a connection and loads the iframe.
- **Warning Banner**: Display a sandbox interactive demo warning banner directly above the iframe inside the modal to notify users it is a simulated environment.
- **Security & Enforced Viewports**: Restrict direct navigation by removing the "Launch App" button so that the prototype can only be viewed in a controlled popup window.

## Proposed Changes

We will modify [portfolio.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/portfolio.tsx) to implement this.

### Portfolio Component

#### [MODIFY] [portfolio.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/portfolio.tsx)

1. **Add state variables**:
   - `previewPrototype`: `PortfolioItem | null` (stores the active portfolio item being previewed)
   - `iframeLoading`: `boolean` (tracks the loading state of the iframe to display a smooth loading spinner)

2. **Create the `PrototypePreviewModal` component**:
   - It will use `AnimatePresence` and `motion.div` from Framer Motion for beautiful fade-in/scale animations matching the site style.
   - It will feature a dark glassmorphic layout (`bg-black/85 backdrop-blur-md`).
   - The preview window will adapt to the screen size (fullscreen on mobile, `w-full max-w-6xl h-[85vh]` on desktop).
   - Inside the header, it will display the prototype title, category, and close action (Launch App button is removed).
   - A golden interactive demo warning banner is rendered directly below the header.
   - An iframe pointing to `item.href` with a loading transition.

3. **Update trigger points**:
   - Update the desktop hover overlay button ("View Prototype") from an `<a>` tag redirection to a `Button` with `onClick={() => setPreviewPrototype(item)}`.
   - Update the mobile bottom bar trigger similarly to trigger `setPreviewPrototype(item)`.

---

## Code Draft

```tsx
function PrototypePreviewModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [loading, setLoading] = useState(true)

  if (!item.href) return null

  return (
    <AnimatePresence>
      <motion.div
        key="preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

        <motion.div
          key="preview-window"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full h-full md:h-[85vh] md:max-w-6xl bg-bg-tertiary md:border md:border-white/10 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="text-left">
                <h4 className="font-serif text-sm font-bold text-white leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] uppercase tracking-wider text-accent-gold font-semibold leading-none mt-0.5">
                  {item.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white hover:bg-white/10 transition-colors rounded-full p-1.5 cursor-pointer"
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Prototype Banner */}
          <div className="bg-amber-500/10 border-b border-amber-500/10 text-amber-400 py-2 px-4 text-center text-[10px] md:text-xs font-semibold font-sans flex items-center justify-center gap-1.5 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Interactive Demo · Sandbox Preview Mode</span>
          </div>

          {/* Interactive Frame Box */}
          <div className="flex-1 relative bg-black/40">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-tertiary z-20 transition-opacity duration-300">
                <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
                <p className="text-xs text-muted-foreground font-mono">
                  Loading prototype viewport...
                </p>
              </div>
            )}
            <iframe
              src={item.href}
              className="w-full h-full border-none bg-white"
              onLoad={() => setLoading(false)}
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

## Verification Plan

### Manual Verification
1. Click **View Prototype** on the "Sterling Direct Purchases" portfolio card.
2. Confirm the modal appears smoothly on the same page.
3. Verify that the loading spinner displays while loading the iframe, then disappears.
4. Verify the warning banner and close buttons function correctly.
5. Inspect responsiveness by resizing the browser window.
