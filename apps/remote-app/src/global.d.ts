declare module "hostApp/user" {
  import { PrimitiveAtom, WritableAtom } from "jotai";

  export const userAtom: PrimitiveAtom<{
    name: string;
    email: string;
    isLoggedIn: boolean;
  }>;

  export const loginAtom: WritableAtom<
    null,
    [{ name: string; email: string }],
    void
  >;

  export const logoutAtom: WritableAtom<null, [], void>;
}
