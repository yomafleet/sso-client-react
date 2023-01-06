/// <reference types="react" />
import { SSOContextInterface } from "../SSOContext";
import { User } from "../User";
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
