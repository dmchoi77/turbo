<template>
  <main class="remote-preview">
    <p>Standalone remote preview / port 4301</p>
    <div class="remote-preview__grid">
      <SignalPanel />
      <SignalCounter />
    </div>
  </main>
</template>

<style>
:root {
  --line: rgba(244, 239, 228, 0.16);
  --paper: #f4efe4;
  --muted: #9ca3aa;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background: #07090c;
  color: var(--paper);
  font-family: "Avenir Next", "Segoe UI", sans-serif;
}

.remote-preview {
  width: min(72rem, calc(100% - 2rem));
  margin: 0 auto;
  padding: 4rem 0;
}

.remote-preview > p {
  margin-bottom: 1.5rem;
  color: #71e6d4;
  font-family: "SFMono-Regular", "Roboto Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.remote-preview__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 700px) {
  .remote-preview__grid {
    grid-template-columns: 1fr;
  }
}
</style>
