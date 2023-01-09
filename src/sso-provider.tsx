import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import SSOClient from "./sso-client";
import { SSOContext } from "./sso-context";
import { initialAuthState } from "./state/auth-state";
import { reducer } from "./state/reducer";
import { User } from "./user";
import { hasAuthParams, parseQuery } from "./utils/utils";

interface SSOProviderProps {
  domain: string;
  clientId: string;
  redirectUri: string;
  onRedirectCalbck: (value: User) => void;
}

const SSOProvider: React.FC<React.PropsWithChildren<SSOProviderProps>> = ({
  domain,
  clientId,
  redirectUri,
  onRedirectCalbck,
  children,
}) => {
  const didInitialise = useRef<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const [client] = useState(
    () =>
      new SSOClient({
        domain,
        client_id: clientId,
        redirect_uri: redirectUri,
      })
  );

  useEffect(() => {
    if (didInitialise.current) return;
    didInitialise.current = true;
    (async (): Promise<void> => {
      try {
        let user: User | undefined;
        if (hasAuthParams()) {
          const queryStringFragments = window.location.href.split("?").slice(1);
          if (queryStringFragments.length === 0)
            throw new Error("There are no query params available for parsing.");
          const { code } = parseQuery(queryStringFragments.join(""));
          if (code) await client.handleRedirectCallback(code);
          user = await client.getUser();
          onRedirectCalbck(user);
        } else {
          user = await client.getUser();
        }
        dispatch({ type: "INITIALISED", user });
      } catch (error) {
        console.log(error);
        dispatch({ type: "ERROR", error: new Error("Login Error") });
      }
    })();
  }, [client, onRedirectCalbck]);

  const loginWithRedirect = useCallback(
    () => client.loginWithRedirect(),
    [client]
  );

  const logout = useCallback(() => client.logout(), [client]);

  const contextValue = useMemo(
    () => ({ ...state, loginWithRedirect, logout }),
    [state, loginWithRedirect, logout]
  );

  return (
    <SSOContext.Provider value={contextValue}>{children}</SSOContext.Provider>
  );
};

export default SSOProvider;
