import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  IS_LOGGED_IN_KEY,
  IS_LOGGED_IN_VALUE,
  REFRESH_TOKEN,
} from "./config/app";
import { oauthToken, TokenResult } from "./api";
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

  async handleRedirectCallback(code: string) {
    const res = await oauthToken({
      baseUrl: "http://localhost:4000/api",
      grant_type: "authorization_code",
      client_id: this.getClientId(),
      code,
      redirect_uri: this.getRedirectUri(),
    });
    if (res) {
      this.saveSession({
        id_token: res?.id_token,
        access_token: res?.access_token,
        refresh_token: res?.refresh_token,
      });
    }
  }

  private saveSession({ id_token, access_token, refresh_token }: TokenResult) {
    window.localStorage.setItem(ID_TOKEN, id_token);
    window.localStorage.setItem(ACCESS_TOKEN, access_token);
    window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
    Cookies.set(IS_LOGGED_IN_KEY, IS_LOGGED_IN_VALUE);
  }

  private authorizeUrl(authorizeOptions: AuthorizeOptions) {
    return `https://${this.getDomain()}/oauth2/authorize?${createQueryParams(
      authorizeOptions
    )}`;
  }

  async getUser<TUser extends User>(): Promise<TUser> {
    return Promise.resolve(
      jwtDecode(window.localStorage.getItem(ID_TOKEN) as string)
    );
  }

  private async checkSession() {
    //
  }

  private getClientId(): string {
    return this.options.client_id;
  }

  private getRedirectUri(): string {
    return this.options.redirect_uri;
  }

  private getDomain(): string {
    // TODO check valid domain
    return this.options.domain;
  }

  private async buildAuthorizeUrl(): Promise<string> {
    return Promise.resolve(
      this.authorizeUrl({
        client_id: this.getClientId(),
        response_type: "code",
        state: "Cognito",
        scope: "aws.cognito.signin.user.admin+email+openid+profile",
        redirect_uri: this.getRedirectUri(),
      })
    );
  }

  private _url(path: string): string {
    return `https://${this.getDomain()}/${path}`;
  }

  private buildLogoutUrl(): string {
    return this._url(
      `/logout?${createQueryParams({
        client_id: this.getClientId(),
        logout_uri: "http://localhost:3000/",
      })}`
    );
  }

  async loginWithRedirect(): Promise<any> {
    const url = await this.buildAuthorizeUrl();
    window.location.assign(url);
  }

  private clearSession() {
    window.localStorage.removeItem(ID_TOKEN);
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
    Cookies.remove(IS_LOGGED_IN_KEY);
  }

  async logout(): Promise<void> {
    this.clearSession();
    const url = this.buildLogoutUrl();
    window.location.assign(url);
  }
}
