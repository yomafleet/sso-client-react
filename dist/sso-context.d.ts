import React from "react";
import { AuthState } from "./state/auth-state";
import { User } from "./user";
export interface SSOContextInterface<TUser extends User = User> extends AuthState {
    user?: TUser;
    loginWithRedirect: () => void;
    refreshToken: () => void;
    logout: () => void;
}
export declare const initialContext: SSOContextInterface;
export declare const SSOContext: React.Context<SSOContextInterface<User>>;
