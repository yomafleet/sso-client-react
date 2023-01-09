import React from "react";
import { AuthState } from "./state/auth-state";
import { User } from "./user";
export interface SSOContextInterface<TUser extends User = User> extends AuthState {
    user?: TUser;
    loginWithRedirect: () => void;
    logout: () => void;
}
export declare const initialContext: {
    loginWithRedirect: () => never;
    logout: () => never;
    error?: Error | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    user?: User | undefined;
};
export declare const SSOContext: React.Context<SSOContextInterface<User>>;
