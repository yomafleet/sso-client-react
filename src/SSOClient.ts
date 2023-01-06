import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { oauthToken, TokenResult } from "./api";
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  IS_LOGGED_IN_KEY,
  IS_LOGGED_IN_VALUE,
  REFRESH_TOKEN,
} from "./config/app";
import { User } from "./User";
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

export default class SSOClient {
  constructor(private options: SSOClientOptions) {}

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
  }: TokenResult): void {
    window.localStorage.setItem(ID_TOKEN, id_token);
    window.localStorage.setItem(ACCESS_TOKEN, access_token);
    window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
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
    return Promise.resolve(
      jwtDecode(window.localStorage.getItem(ID_TOKEN) as string)
    );
  }

  private async checkSession() {
    //
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
      scope: "aws.cognito.signin.user.admin+email+openid+profile",
      redirect_uri: this.getRedirectUri(),
    });

  /**
   * base url
   *
   * @param path string
   * @returns string
   */
  private _url(path: string): string {
    return `https://${this.getDomain()}/${path}`;
  }

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
   *
   */
  async loginWithRedirect(): Promise<any> {
    const url = this.buildAuthorizeUrl();
    window.location.assign(url);
  }

  /**
   * clear session  from storage
   *
   * @reutrn void
   */
  private clearSession() {
    window.localStorage.removeItem(ID_TOKEN);
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
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
