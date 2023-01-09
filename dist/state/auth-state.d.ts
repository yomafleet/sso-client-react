import { User } from "../user";
export interface AuthState<TUser extends User = User> {
    error?: Error;
    isAuthenticated: boolean;
    isLoading: boolean;
    user?: TUser;
}
/**
 * The initial auth state.
 */
export declare const initialAuthState: AuthState;
