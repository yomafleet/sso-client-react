import { User } from "./user";
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
    private options;
    constructor(options: SSOClientOptions);
    /**
     * handle redirect callback that assign url from auth server
     *
     * @param code string
     * @return Promise<void>
     */
    handleRedirectCallback(code: string): Promise<void>;
    /**
     * handle to save session to storage
     *
     * @param param0 TokenResult
     */
    private saveSession;
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
    private authorizeUrl;
    /**
     * parse auth user from id_token
     *
     * @returns Promise<User>
     */
    getUser<TUser extends User>(): Promise<TUser>;
    private checkSession;
    /**
     * get client_id
     *
     * @returns string
     */
    private getClientId;
    /**
     * get redirect_uri
     *
     * @returns string
     */
    private getRedirectUri;
    /**
     * get domain
     *
     * @returns string
     */
    private getDomain;
    /**
     * build authorize url
     *
     * @returns string
     */
    private buildAuthorizeUrl;
    /**
     * base url
     *
     * @param path string
     * @returns string
     */
    private _url;
    /**
     * build logout url
     *
     * @returns string
     */
    private buildLogoutUrl;
    /**
     * login with redirect, when press login button it will redirect to hosted ui
     *
     * @returns Promise<any>
     */
    loginWithRedirect(): Promise<any>;
    /**
     * clear session  from storage
     *
     * @reutrn void
     */
    private clearSession;
    /**
     * handle logout
     *
     * @return Promise<void>
     */
    logout(): Promise<void>;
}
