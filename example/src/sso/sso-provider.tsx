import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import SSOClient from "./sso-client";
import { SSOContext } from "./sso-context";
import { initialAuthState } from "./state/auth-state";
import { reducer } from "./state/reducer";
import { User } from "./user";
import { hasAuthParams } from "./utils/utils";

type SSOProviderProps = {
  client: SSOClient;
  onRedirectCalback: (value: User) => void;
};

const SSOProvider: React.FC<React.PropsWithChildren<SSOProviderProps>> = ({
  client,
  onRedirectCalback,
  children,
}) => {
  const didInitialise = useRef<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    if (didInitialise.current) return;
    didInitialise.current = true;
    (async (): Promise<void> => {
      try {
        let user: User | undefined;
        if (hasAuthParams()) {
          await client.handleRedirectCallback();
          user = client.getUser();
          onRedirectCalback(user);
        } else {
          if (client.hasSession()) user = client.getUser();
        }
        dispatch({ type: "INITIALISED", user });
      } catch (error) {
        console.error(error);
        dispatch({ type: "ERROR", error: new Error("Login Error") });
      }
    })();
  }, [client, onRedirectCalback]);

  const loginWithRedirect = useCallback(
    async () => await client.loginWithRedirect(),
    [client]
  );

  const refreshToken = useCallback(
    async () => await client.refreshToken(),
    [client]
  );

  const logout = useCallback(() => client.logout(), [client]);

  const contextValue = useMemo(
    () => ({
      ...state,
      loginWithRedirect,
      logout,
      refreshToken,
    }),
    [state, loginWithRedirect, logout, refreshToken]
  );

  return (
    <SSOContext.Provider value={contextValue}>{children}</SSOContext.Provider>
  );
};

export default SSOProvider;
