import { useContext } from "react";
import { SSOContext, SSOContextInterface } from "../sso-context";
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
const useAuth = <TUser extends User = User>(
  context = SSOContext
): SSOContextInterface<TUser> => {
  if (context === undefined) {
    throw new Error("You forgot to wrap your component in <SSOProvider>.");
  }

  return useContext(context) as SSOContextInterface<TUser>;
};

export default useAuth;
