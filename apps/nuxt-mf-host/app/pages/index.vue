<script setup lang="ts">
useHead({
  title: "Nuxt Federation Signal Console",
  meta: [
    {
      name: "description",
      content: "Nuxt Module Federation SSR and CSR verification console.",
    },
  ],
});
</script>

<template>
  <main>
    <div class="ambient ambient--one" />
    <div class="ambient ambient--two" />

    <header class="masthead">
      <div class="masthead__brand">
        <span class="brand-mark" aria-hidden="true">MF</span>
        <span>Nuxt federation lab</span>
      </div>
      <div class="masthead__meta">
        <span>HOST :4300</span>
        <span>REMOTE :4301</span>
        <span class="live-dot">LINK ACTIVE</span>
      </div>
    </header>

    <section class="hero">
      <p class="hero__kicker">Runtime transmission / 2026</p>
      <h1>
        One page.
        <span>Two runtimes.</span>
        Zero static illusion.
      </h1>
      <p class="hero__lede">
        The source response proves server rendering. The counters below prove
        that the same federated markup survives hydration and becomes
        interactive in the browser.
      </p>
    </section>

    <section class="signal-grid" aria-label="Federation signals">
      <HostSignal />
      <RemoteSignalPanel />
      <RemoteSignalCounter />
    </section>

    <footer class="footer">
      <span>SSR → HTML payload</span>
      <span>CSR → hydrated controls</span>
      <span>REMOTE → Module Federation</span>
    </footer>
  </main>
</template>

<style>
:root {
  --ink: #07090c;
  --paper: #f4efe4;
  --muted: #9ca3aa;
  --line: rgba(244, 239, 228, 0.16);
  --orange: #f1b24a;
  --cyan: #71e6d4;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--ink);
  color-scheme: dark;
}

body {
  margin: 0;
  background: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    var(--ink);
  background-size: 42px 42px;
  color: var(--paper);
  font-family: "Avenir Next", "Segoe UI", sans-serif;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

main {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow: hidden;
  padding: 0 clamp(1rem, 4vw, 4.5rem);
}

.ambient {
  position: absolute;
  z-index: -1;
  width: 34rem;
  height: 34rem;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.14;
  pointer-events: none;
}

.ambient--one {
  top: -18rem;
  right: -8rem;
  background: var(--orange);
}

.ambient--two {
  bottom: -22rem;
  left: -12rem;
  background: var(--cyan);
}

.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5rem;
  border-bottom: 1px solid var(--line);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.masthead__brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-weight: 700;
}

.brand-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  background: var(--paper);
  color: var(--ink);
  font-size: 0.65rem;
}

.masthead__meta {
  display: flex;
  gap: 1.6rem;
  color: var(--muted);
}

.live-dot {
  color: var(--cyan);
}

.live-dot::before {
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.55rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 1rem currentColor;
  content: "";
  animation: pulse 1.8s ease-in-out infinite;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(15rem, 0.6fr);
  gap: clamp(2rem, 7vw, 8rem);
  align-items: end;
  padding: clamp(4rem, 11vw, 8.5rem) 0 clamp(3rem, 7vw, 5rem);
}

.hero__kicker {
  grid-column: 1 / -1;
  margin: 0 0 -0.8rem;
  color: var(--orange);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  max-width: 14ch;
  margin: 0;
  font-family: "Arial Narrow", "Avenir Next Condensed", sans-serif;
  font-size: clamp(3.7rem, 9vw, 8.8rem);
  font-stretch: condensed;
  font-weight: 900;
  letter-spacing: -0.075em;
  line-height: 0.8;
  text-transform: uppercase;
}

h1 span {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px var(--paper);
}

.hero__lede {
  max-width: 29rem;
  margin: 0;
  padding-left: 1.2rem;
  border-left: 2px solid var(--orange);
  color: var(--muted);
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
  line-height: 1.75;
}

.signal-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-bottom: 4rem;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  justify-content: space-between;
  padding: 1.4rem 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@keyframes pulse {
  50% {
    opacity: 0.35;
    transform: scale(0.72);
  }
}

@media (max-width: 900px) {
  .masthead__meta span:not(.live-dot) {
    display: none;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero__kicker {
    grid-column: auto;
  }

  .signal-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot::before {
    animation: none;
  }
}
</style>
