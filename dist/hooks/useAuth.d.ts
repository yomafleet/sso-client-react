/// <reference types="react" />
import { SSOContextInterface } from "../sso-context";
import { User } from "../user";
/**
 * ```js
 * const {
 *  user,
 *  loginWithRedirect,
 *  logout
 * } = useAuth();
 * ```
 * use auth hook
 *
 * @param context SSOContext
 * @returns SSOContextInterface<TUser>
 */
declare const useAuth: <TUser extends User = User>(context?: import("react").Context<SSOContextInterface<User>>) => SSOContextInterface<TUser>;
export default useAuth;
