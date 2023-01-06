import { User } from "../User";
import { AuthState } from "./auth-state";
type Action = {
    type: "INITIALISED" | "GET_ACCESS_TOKEN_COMPLETE" | "HANDLE_REDIRECT_COMPLETE";
    user?: User;
} | {
    type: "LOGOUT";
} | {
    type: "ERROR";
    error: Error;
};
export declare const reducer: (state: AuthState, action: Action) => AuthState;
export {};
