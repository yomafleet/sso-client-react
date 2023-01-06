import { useContext } from "react";
import { SSOContext, SSOContextInterface } from "../SSOContext";
import { User } from "../User";

const useAuth = <TUser extends User = User>(
  context = SSOContext
): SSOContextInterface<TUser> =>
  useContext(context) as SSOContextInterface<TUser>;

export default useAuth;
