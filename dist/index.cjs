'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * The initial auth state.
 */
const initialAuthState = {
    isAuthenticated: false,
    isLoading: true,
};

/**
 * @ignore
 */
const stub = () => {
    throw new Error("You forgot to wrap your component in <SSOProvider>.");
};
const initialContext = Object.assign(Object.assign({}, initialAuthState), { loginWithRedirect: stub, refreshToken: stub, logout: stub });
const SSOContext = React__default["default"].createContext(initialContext);

/**
 * ```js
 * const {
 *  user,
 *  loginWithRedirect,
 *  logout
 * } = useAuth();
 * ```
 * use auth hook
 *
 * @param context SSOContext
 * @returns SSOContextInterface<TUser>
 */
const useAuth = (context = SSOContext) => {
    if (context === undefined)
        throw new Error(`useAuth must be used within a SSOProvider`);
    return React.useContext(context);
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

/**
 * request oauth token `domain/oauth2/token`
 *
 * @param param0 OauthTokenProps
 * @returns Promise<TokenResult>
 */
const oauthToken = ({ baseUrl, grant_type, client_id, code, redirect_uri, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${baseUrl}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type,
                client_id,
                code,
                redirect_uri,
            }),
        });
        if (!res.ok)
            throw new Error("Error Fetching Token");
        return yield res.json();
    }
    catch (error) {
        throw new Error("Error Fetching Token");
    }
});
/**
 * request oauth token `domain/oauth2/token`
 *
 * @param param0 OauthTokenProps
 * @returns Promise<TokenResult>
 */
const refreshToken = ({ baseUrl, client_id, refresh_token, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${baseUrl}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id,
                refresh_token,
            }),
        });
        if (!res.ok)
            throw new Error("Error Fetching Token");
        return yield res.json();
    }
    catch (error) {
        throw new Error("Error Fetching Token");
    }
});

const ACCESS_TOKEN = "Yoma_Fleet_access_token";
const REFRESH_TOKEN = "Yoma_Fleet_refresh_token";
const ID_TOKEN = "Yoma_Fleet_id_token";
const EXPIRES_IN = "Yoma_Fleet_expires_in";

class LocalStorageManager {
    constructor(prefix = "SSO_Client") {
        this.prefix = prefix;
    }
    /**
     * set item to localStorage
     *
     * @param key string
     * @param value string
     * @return void
     */
    setItem(key, value) {
        window.localStorage.setItem(`${this.prefix}__${key}`, JSON.stringify(value));
    }
    /**
     * get item from localStorage
     *
     * @param key string
     * @returns T | undefined
     */
    getItem(key) {
        const json = window.localStorage.getItem(`${this.prefix}__${key}`);
        if (!json)
            return;
        try {
            return JSON.parse(json);
        }
        catch (e) {
            return;
        }
    }
    /**
     * remove item from localStorage
     *
     * @param key string
     * @return void
     */
    removeItem(key) {
        window.localStorage.removeItem(`${this.prefix}__${key}`);
    }
}

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;
const hasAuthParams = (searchParams = window.location.search) => (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
    STATE_RE.test(searchParams);
/**
 * create query params from object
 *
 * @param params any
 * @returns string
 */
const createQueryParams = (params) => Object.keys(params)
    .filter((k) => typeof params[k] !== "undefined")
    // .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .map((k) => k + "=" + params[k])
    .join("&");
/**
 * parse authentication result
 *
 * @param queryString string
 * @returns AuthenticationResult
 */
const parseAuthenticationResult = (queryString) => {
    if (queryString.indexOf("#") > -1)
        queryString = queryString.substring(0, queryString.indexOf("#"));
    const searchParams = new URLSearchParams(queryString);
    return {
        state: searchParams.get("state"),
        code: searchParams.get("code") || undefined,
        error: searchParams.get("error") || undefined,
        error_description: searchParams.get("error_description") || undefined,
    };
};

class SSOClient {
    constructor(options, storage = new LocalStorageManager()) {
        this.options = options;
        this.storage = storage;
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
        this.authorizeUrl = (authorizeOptions) => `https://${this.getDomain()}/oauth2/authorize?${createQueryParams(authorizeOptions)}`;
        /**
         * get client_id
         *
         * @returns string
         */
        this.getClientId = () => this.options.client_id;
        /**
         * get redirect_uri
         *
         * @returns string
         */
        this.getRedirectUri = () => this.options.redirect_uri;
        /**
         * build authorize url
         *
         * @returns string
         */
        this.buildAuthorizeUrl = () => this.authorizeUrl({
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
        this._url = (path) => `https://${this.getDomain()}/${path}`;
        /**
         * build logout url
         *
         * @returns string
         */
        this.buildLogoutUrl = ({ logout_uri, client_id }) => this._url(`/logout?${createQueryParams({
            client_id,
            logout_uri,
        })}`);
    }
    /**
     * handle redirect callback that assign url from auth server
     *
     * @param url string
     * @defualt {url: window.location.href}
     * @return Promise<void>
     */
    handleRedirectCallback(url = window.location.href) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryStringFragments = url.split("?").slice(1);
            if (queryStringFragments.length === 0) {
                throw new Error("There are no query params available for parsing.");
            }
            const { state, code, error } = parseAuthenticationResult(queryStringFragments.join(""));
            if (error)
                throw new Error(error);
            if (state !==
                "Cognito" /** just hardcoded state value , we need to make a hashed state key */)
                throw new Error("Invalid State");
            yield this._requestToken(code);
        });
    }
    /**
     * handle request oauth token and save to the session
     *
     * @param code string
     * @return Promise<void>
     */
    _requestToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield oauthToken({
                baseUrl: `https://${this.getDomain()}`,
                grant_type: "authorization_code",
                client_id: this.getClientId(),
                code,
                redirect_uri: this.getRedirectUri(),
            });
            this.saveSession({
                id_token: res === null || res === void 0 ? void 0 : res.id_token,
                access_token: res === null || res === void 0 ? void 0 : res.access_token,
                refresh_token: res === null || res === void 0 ? void 0 : res.refresh_token,
                expires_in: res.expires_in,
            });
        });
    }
    /**
     * handle to save session to storage
     *
     * @param param0 TokenResult
     */
    saveSession({ id_token, access_token, refresh_token, expires_in, }) {
        this.storage.setItem(ID_TOKEN, id_token);
        this.storage.setItem(ACCESS_TOKEN, access_token);
        if (refresh_token)
            this.storage.setItem(REFRESH_TOKEN, refresh_token);
        if (expires_in)
            this.storage.setItem(EXPIRES_IN, expires_in.toString());
    }
    hasSession() {
        const session = this.getSession();
        return session ? true : false;
    }
    /**
     * parse auth user from id_token
     *
     * @returns Promise<User>
     */
    getUser() {
        const id_token = this.storage.getItem(ID_TOKEN);
        return o(id_token);
    }
    /**
     * check token is expried or not
     *
     * @param token string
     * @returns boolean
     */
    isJwtExpired(token) {
        if (typeof token !== "string" || !token)
            return false;
        const { exp } = o(token);
        const currentTime = new Date().getTime() / 1000;
        return !exp || currentTime > exp;
    }
    /**
     * check has valid session on storage or not
     *
     * @returns Promise<boolean>
     */
    getSession() {
        const access_token = this.storage.getItem(ACCESS_TOKEN);
        const id_token = this.storage.getItem(ID_TOKEN);
        const refresh_token = this.storage.getItem(REFRESH_TOKEN);
        // const expires_in = this.storage.getItem(EXPIRES_IN);
        if (access_token &&
            id_token &&
            refresh_token &&
            !this.isJwtExpired(access_token)) {
            return {
                access_token,
                id_token,
                refresh_token,
            };
        }
        else {
            return null;
        }
    }
    /**
     * get domain
     *
     * @returns string
     */
    getDomain() {
        // TODO check valid domain
        return this.options.domain;
    }
    /**
     * login with redirect, when press login button it will redirect to hosted ui
     *
     * @returns Promise<void>
     */
    loginWithRedirect() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildAuthorizeUrl();
            window.location.assign(url);
        });
    }
    /**
     * refresh token request to cognito and
     * save access_token, id_token and expries_in to session
     *
     * @return Promise<void>
     */
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield refreshToken({
                baseUrl: `https://${this.getDomain()}`,
                client_id: this.getClientId(),
                refresh_token: this.getRefreshToken(),
            });
            this.saveSession({
                id_token: res === null || res === void 0 ? void 0 : res.id_token,
                access_token: res === null || res === void 0 ? void 0 : res.access_token,
                expires_in: res.expires_in,
            });
        });
    }
    /**
     * get refresh_token from session
     *
     * @returns string
     */
    getRefreshToken() {
        return this.storage.getItem(REFRESH_TOKEN);
    }
    /**
     * clear session  from storage
     *
     * @reutrn void
     */
    clearSession() {
        [ID_TOKEN, ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_IN].forEach((key) => this.storage.removeItem(key));
    }
    /**
     * handle logout
     *
     * @return Promise<void>
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearSession();
            const url = this.buildLogoutUrl({
                client_id: this.getClientId(),
                logout_uri: this.getRedirectUri(),
            });
            window.location.assign(url);
        });
    }
}

const reducer = (state, action) => {
    var _a, _b;
    switch (action.type) {
        case "INITIALISED":
            return Object.assign(Object.assign({}, state), { isAuthenticated: !!action.user, user: action.user, isLoading: false, error: undefined });
        case "HANDLE_REDIRECT_COMPLETE":
        case "GET_ACCESS_TOKEN_COMPLETE":
            if (((_a = state.user) === null || _a === void 0 ? void 0 : _a.updated_at) === ((_b = action.user) === null || _b === void 0 ? void 0 : _b.updated_at)) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { isAuthenticated: !!action.user, user: action.user });
        case "LOGOUT":
            return Object.assign(Object.assign({}, state), { isAuthenticated: false, user: undefined });
        case "ERROR":
            return Object.assign(Object.assign({}, state), { isLoading: false, error: action.error });
    }
};

const SSOProvider = ({ client, onRedirectCalback, children, }) => {
    const didInitialise = React.useRef(false);
    const [state, dispatch] = React.useReducer(reducer, initialAuthState);
    React.useEffect(() => {
        if (didInitialise.current)
            return;
        didInitialise.current = true;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let user;
                if (hasAuthParams()) {
                    yield client.handleRedirectCallback();
                    user = client.getUser();
                    onRedirectCalback(user);
                }
                else {
                    if (client.hasSession())
                        user = client.getUser();
                }
                dispatch({ type: "INITIALISED", user });
            }
            catch (error) {
                console.error(error);
                dispatch({ type: "ERROR", error: new Error("Login Error") });
            }
        }))();
    }, [client, onRedirectCalback]);
    const loginWithRedirect = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () { return yield client.loginWithRedirect(); }), [client]);
    const refreshToken = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () { return yield client.refreshToken(); }), [client]);
    const logout = React.useCallback(() => client.logout(), [client]);
    const contextValue = React.useMemo(() => (Object.assign(Object.assign({}, state), { loginWithRedirect,
        logout,
        refreshToken })), [state, loginWithRedirect, logout, refreshToken]);
    return (jsxRuntime.jsx(SSOContext.Provider, Object.assign({ value: contextValue }, { children: children })));
};

exports.SSOClient = SSOClient;
exports.SSOProvider = SSOProvider;
exports.useAuth = useAuth;
//# sourceMappingURL=index.cjs.map
