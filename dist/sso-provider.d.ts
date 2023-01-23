import React from "react";
import SSOClient from "./sso-client";
import { User } from "./user";
type SSOProviderProps = {
    client: SSOClient;
    onRedirectCalback: (value: User) => void;
};
declare const SSOProvider: React.FC<React.PropsWithChildren<SSOProviderProps>>;
export default SSOProvider;
