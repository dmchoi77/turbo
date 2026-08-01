<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <article class="signal-card signal-card--host" data-test="host-signal">
    <header class="signal-card__header">
      <span class="signal-card__eyebrow">LOCAL / SIGNAL 01</span>
      <span class="signal-card__state">ONLINE</span>
    </header>

    <div class="signal-card__body">
      <div aria-hidden="true" class="signal-card__glyph">H</div>
      <div>
        <h2>Host process</h2>
        <p data-test="host-ssr-marker">Host payload rendered during SSR.</p>
      </div>
    </div>

    <button data-test="host-counter" type="button" @click="count++">
      <span>Hydration pulse</span>
      <strong>{{ count.toString().padStart(2, "0") }}</strong>
    </button>
  </article>
</template>

<style scoped>
.signal-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  background: rgba(9, 13, 18, 0.9);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
}

.signal-card::after {
  position: absolute;
  right: -4rem;
  bottom: -5rem;
  width: 12rem;
  height: 12rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  content: "";
}

.signal-card--host {
  --card-accent: #f1b24a;
}

.signal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
}

.signal-card__state {
  color: var(--card-accent);
}

.signal-card__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.15rem;
  align-items: center;
  min-height: 8rem;
  padding: 1.4rem;
}

.signal-card__glyph {
  display: grid;
  width: 4.2rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--card-accent);
  color: var(--card-accent);
  font-family: "Arial Narrow", sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
}

h2 {
  margin: 0;
  color: var(--paper);
  font-family: "Arial Narrow", "Avenir Next Condensed", sans-serif;
  font-size: clamp(1.55rem, 4vw, 2.2rem);
  font-stretch: condensed;
  letter-spacing: -0.035em;
  text-transform: uppercase;
}

p {
  max-width: 24rem;
  margin: 0.45rem 0 0;
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.5;
}

button {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.4rem;
  border: 0;
  border-top: 1px solid var(--line);
  background: transparent;
  color: var(--paper);
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    color 180ms ease,
    background 180ms ease;
}

button:hover,
button:focus-visible {
  background: var(--card-accent);
  color: #111316;
  outline: none;
}

button strong {
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 1.3rem;
}
</style>
