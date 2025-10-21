declare module "remoteApp/App" {
  const RemoteApp: React.ComponentType;
  export default RemoteApp;
}

declare module "remoteApp/count" {
  const countAtom: ReturnType<typeof atom<number>>;
  export { countAtom };
}
