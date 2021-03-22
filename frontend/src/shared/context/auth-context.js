import { createContext } from "react";

// createContext returns an object with property of provider which behaves like a react component
// wrap this component around all elements at the app level to give all children access to the object passed to createContext
// the object being passed to createContext is the default value passed to the provider (App level) - default value only used when componen does not have matching provider above it in tree
export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userId: null,
});
