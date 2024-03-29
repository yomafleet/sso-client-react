import React from "react";
import { AuthState, initialAuthState } from "./state/auth-state";
import { User } from "./user";

export interface SSOContextInterface<TUser extends User = User>
  extends AuthState {
  user?: TUser;
  loginWithRedirect: () => void;
  refreshToken: () => void;
  logout: () => void;
}

/**
 * @ignore
 */
const stub = (): never => {
  throw new Error("You forgot to wrap your component in <SSOProvider>.");
};

export const initialContext: SSOContextInterface = {
  ...initialAuthState,
  loginWithRedirect: stub,
  refreshToken: stub,
  logout: stub,
};

export const SSOContext =
  React.createContext<SSOContextInterface>(initialContext);
