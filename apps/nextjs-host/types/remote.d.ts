// Type declarations for Module Federation remotes
declare module "remoteApp/App" {
  const App: React.ComponentType;
  export default App;
}

declare module "remoteApp/count" {
  export const countAtom: import("jotai").PrimitiveAtom<number>;
}
