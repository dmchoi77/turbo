<template>
  <article class="signal-card signal-card--remote" data-test="remote-panel">
    <header class="signal-card__header">
      <span>FEDERATED / SIGNAL 02</span>
      <span class="signal-card__state">SSR LOCKED</span>
    </header>

    <div class="signal-card__body">
      <div aria-hidden="true" class="signal-card__glyph">R</div>
      <div>
        <h2>Remote payload</h2>
        <p data-test="remote-ssr-marker">Remote payload rendered during SSR.</p>
      </div>
    </div>

    <div class="signal-card__readout">
      <span>ORIGIN</span>
      <strong>signalRemote@4301</strong>
    </div>
  </article>
</template>

<style scoped>
.signal-card {
  --card-accent: #71e6d4;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line, rgba(244, 239, 228, 0.16));
  background: rgba(9, 13, 18, 0.9);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
}

.signal-card::before {
  position: absolute;
  top: 3rem;
  right: -3.5rem;
  width: 9rem;
  height: 9rem;
  border: 1px dashed rgba(113, 230, 212, 0.25);
  border-radius: 50%;
  content: "";
}

.signal-card__header,
.signal-card__readout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.9rem;
  color: var(--muted, #9ca3aa);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
}

.signal-card__header {
  border-bottom: 1px solid var(--line, rgba(244, 239, 228, 0.16));
}

.signal-card__state {
  color: var(--card-accent);
}

.signal-card__body {
  position: relative;
  z-index: 1;
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
  color: var(--paper, #f4efe4);
  font-family: "Arial Narrow", "Avenir Next Condensed", sans-serif;
  font-size: clamp(1.55rem, 4vw, 2.2rem);
  letter-spacing: -0.035em;
  text-transform: uppercase;
}

p {
  max-width: 24rem;
  margin: 0.45rem 0 0;
  color: var(--muted, #9ca3aa);
  font-size: 0.85rem;
  line-height: 1.5;
}

.signal-card__readout {
  border-top: 1px solid var(--line, rgba(244, 239, 228, 0.16));
}

.signal-card__readout strong {
  color: var(--card-accent);
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}
</style>
