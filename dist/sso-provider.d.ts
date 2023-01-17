import React from "react";
import SSOClient from "./sso-client";
import { User } from "./user";
interface SSOProviderProps {
    client: SSOClient;
    onRedirectCalbck: (value: User) => void;
}
declare const SSOProvider: React.FC<React.PropsWithChildren<SSOProviderProps>>;
export default SSOProvider;
