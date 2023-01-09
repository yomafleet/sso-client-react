import React from "react";
import { User } from "./user";
interface SSOProviderProps {
    domain: string;
    clientId: string;
    redirectUri: string;
    onRedirectCalbck: (value: User) => void;
}
declare const SSOProvider: React.FC<React.PropsWithChildren<SSOProviderProps>>;
export default SSOProvider;
