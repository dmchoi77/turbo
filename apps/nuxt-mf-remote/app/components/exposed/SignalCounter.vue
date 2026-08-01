<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <article class="counter-card" data-test="remote-counter-card">
    <div class="counter-card__scan" aria-hidden="true" />
    <header>
      <span>FEDERATED / SIGNAL 03</span>
      <span>HYDRATION TEST</span>
    </header>

    <div class="counter-card__content">
      <p>Remote interaction count</p>
      <output data-test="remote-count">{{
        count.toString().padStart(2, "0")
      }}</output>
      <button data-test="remote-counter" type="button" @click="count++">
        Transmit pulse
      </button>
    </div>
  </article>
</template>

<style scoped>
.counter-card {
  position: relative;
  overflow: hidden;
  min-height: 100%;
  border: 1px solid var(--line, rgba(244, 239, 228, 0.16));
  background: #f1b24a;
  color: #111316;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
}

.counter-card__scan {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 7px,
    rgba(17, 19, 22, 0.22) 8px
  );
  pointer-events: none;
}

header {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid rgba(17, 19, 22, 0.3);
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.counter-card__content {
  position: relative;
  display: grid;
  min-height: 13.35rem;
  padding: 1.3rem 1.4rem 1.4rem;
}

p {
  align-self: start;
  margin: 0;
  font-family: "Arial Narrow", "Avenir Next Condensed", sans-serif;
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

output {
  align-self: center;
  font-family: "Arial Narrow", "Avenir Next Condensed", sans-serif;
  font-size: clamp(4rem, 9vw, 7.2rem);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.7;
}

button {
  align-self: end;
  justify-self: start;
  padding: 0.65rem 0.85rem;
  border: 1px solid #111316;
  background: transparent;
  color: #111316;
  cursor: pointer;
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    background 160ms ease,
    color 160ms ease;
}

button:hover,
button:focus-visible {
  background: #111316;
  color: #f1b24a;
  outline: none;
}
</style>
