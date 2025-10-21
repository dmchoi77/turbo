import { atom } from "jotai";

export const userAtom = atom({
  name: "Guest",
  email: "guest@example.com",
  isLoggedIn: false,
});

export const loginAtom = atom(
  null,
  (_, set, userData: { name: string; email: string }) => {
    set(userAtom, {
      ...userData,
      isLoggedIn: true,
    });
  }
);

export const logoutAtom = atom(null, (_, set) => {
  set(userAtom, {
    name: "Guest",
    email: "guest@example.com",
    isLoggedIn: false,
  });
});
