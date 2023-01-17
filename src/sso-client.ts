import Cookies from "js-cookie";
import jwtDecode, { JwtPayload } from "jwt-decode";

import {
  oauthToken,
  refreshToken as fetchRefreshToken,
  TokenResult,
} from "./api";
import {
  ACCESS_TOKEN,
  EXPIRES_IN,
  ID_TOKEN,
  IS_LOGGED_IN_KEY,
  IS_LOGGED_IN_VALUE,
  REFRESH_TOKEN,
} from "./config/app";
import { IStorageManager, LocalStorageManager } from "./storage";
import { User } from "./user";
import { createQueryParams } from "./utils/utils";

export interface SSOClientOptions {
  domain: string;
  client_id: string;
  redirect_uri: string;
}

export interface AuthorizeOptions {
  response_type: string;
  redirect_uri: string;
  state: string;
  scope: string;
  client_id: string;
}

export interface LogoutOptions {
  client_id: string;
  logout_uri: string;
}

type Session = TokenResult;

export default class SSOClient {
  constructor(
    private options: SSOClientOptions,
    private storage: IStorageManager = new LocalStorageManager()
  ) {}

  /**
   * handle redirect callback that assign url from auth server
   *
   * @param code string
   * @return Promise<void>
   */
  async handleRedirectCallback(code: string): Promise<void> {
    const res = await oauthToken({
      baseUrl: `https://${this.getDomain()}`,
      grant_type: "authorization_code",
      client_id: this.getClientId(),
      code,
      redirect_uri: this.getRedirectUri(),
    });
    this.saveSession({
      id_token: res?.id_token,
      access_token: res?.access_token,
      refresh_token: res?.refresh_token,
      expires_in: res.expires_in,
    });
  }

  /**
   * handle to save session to storage
   *
   * @param param0 TokenResult
   */
  private saveSession({
    id_token,
    access_token,
    refresh_token,
    expires_in,
  }: TokenResult): void {
    this.storage.setItem(ID_TOKEN, id_token);
    this.storage.setItem(ACCESS_TOKEN, access_token);
    if (refresh_token) this.storage.setItem(REFRESH_TOKEN, refresh_token);
    if (expires_in) this.storage.setItem(EXPIRES_IN, expires_in.toString());
    Cookies.set(IS_LOGGED_IN_KEY, IS_LOGGED_IN_VALUE);
  }

  /**
   * build authorize url, authorize url is just a redirect url
   * The /oauth2/authorize endpoint is a redirection endpoint
   * that supports two redirect destinations.
   * If you include an identity_provider or idp_identifier parameter in the URL,
   * it silently redirects your user to the sign-in page for that identity provider (IdP).
   * Otherwise, it redirects to the Login endpoint with the same URL parameters that you included in your request.
   *
   * @param authorizeOptions AuthorizeOptions
   * @returns string
   */
  private authorizeUrl = (authorizeOptions: AuthorizeOptions) =>
    `https://${this.getDomain()}/oauth2/authorize?${createQueryParams(
      authorizeOptions
    )}`;

  /**
   * parse auth user from id_token
   *
   * @returns Promise<User>
   */
  async getUser<TUser extends User>(): Promise<TUser> {
    // if (!this.getSession()) {
    //   return Promise.reject("Invalid session");
    // }
    const id_token = this.storage.getItem<string>(ID_TOKEN);
    // if (!id_token) return Promise.reject("id_token not defined");
    return Promise.resolve(jwtDecode(id_token as string));
  }

  /**
   * check token is expried or not
   *
   * @param token string
   * @returns boolean
   */
  private isJwtExpired(token: string): boolean {
    if (typeof token !== "string" || !token) return false;
    const { exp } = jwtDecode<JwtPayload>(token);
    const currentTime = new Date().getTime() / 1000;
    return !exp || currentTime > exp;
  }

  /**
   * check has valid session on storage or not
   *
   * @returns Promise<boolean>
   */
  getSession(): Session | null {
    const access_token = this.storage.getItem<string>(ACCESS_TOKEN);
    const id_token = this.storage.getItem<string>(ID_TOKEN);
    const refresh_token = this.storage.getItem<string>(REFRESH_TOKEN);
    // const expires_in = this.storage.getItem(EXPIRES_IN);
    if (
      access_token &&
      id_token &&
      refresh_token &&
      !this.isJwtExpired(access_token)
    ) {
      return {
        access_token,
        id_token,
        refresh_token,
      };
    } else {
      return null;
    }
  }

  /**
   * get client_id
   *
   * @returns string
   */
  private getClientId = (): string => this.options.client_id;

  /**
   * get redirect_uri
   *
   * @returns string
   */
  private getRedirectUri = (): string => this.options.redirect_uri;

  /**
   * get domain
   *
   * @returns string
   */
  private getDomain(): string {
    // TODO check valid domain
    return this.options.domain;
  }

  /**
   * build authorize url
   *
   * @returns string
   */
  private buildAuthorizeUrl = (): string =>
    this.authorizeUrl({
      client_id: this.getClientId(),
      response_type: "code",
      state: "Cognito",
      scope: "email+openid+profile",
      redirect_uri: this.getRedirectUri(),
    });

  /**
   * base url
   *
   * @param path string
   * @returns string
   */
  private _url = (path: string): string =>
    `https://${this.getDomain()}/${path}`;

  /**
   * build logout url
   *
   * @returns string
   */
  private buildLogoutUrl = ({ logout_uri, client_id }: LogoutOptions): string =>
    this._url(
      `/logout?${createQueryParams({
        client_id,
        logout_uri,
      })}`
    );

  /**
   * login with redirect, when press login button it will redirect to hosted ui
   *
   * @returns Promise<void>
   */
  async loginWithRedirect(): Promise<void> {
    const url = this.buildAuthorizeUrl();
    window.location.assign(url);
  }

  /**
   * refresh token request to cognito and
   * save access_token, id_token and expries_in to session
   *
   * @return Promise<void>
   */
  async refreshToken(): Promise<void> {
    const res = await fetchRefreshToken({
      baseUrl: `https://${this.getDomain()}`,
      client_id: this.getClientId(),
      refresh_token: this.getRefreshToken(),
    });
    this.saveSession({
      id_token: res?.id_token,
      access_token: res?.access_token,
      expires_in: res.expires_in,
    });
  }

  /**
   * get refresh_token from session
   *
   * @returns string
   */
  private getRefreshToken() {
    return this.storage.getItem<string>(REFRESH_TOKEN);
  }

  /**
   * clear session  from storage
   *
   * @reutrn void
   */
  clearSession(): void {
    [ID_TOKEN, ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_IN].forEach((key) =>
      this.storage.removeItem(key)
    );
    Cookies.remove(IS_LOGGED_IN_KEY);
  }

  /**
   * handle logout
   *
   * @return Promise<void>
   */
  async logout(): Promise<void> {
    this.clearSession();
    const url = this.buildLogoutUrl({
      client_id: this.getClientId(),
      logout_uri: this.getRedirectUri(),
    });
    window.location.assign(url);
  }
}
