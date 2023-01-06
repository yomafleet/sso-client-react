import React, { useContext, useRef, useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';

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
const initialContext = Object.assign(Object.assign({}, initialAuthState), { loginWithRedirect: stub, logout: stub });
const SSOContext = React.createContext(initialContext);

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
const useAuth = (context = SSOContext) => useContext(context);

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

/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });

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

const ACCESS_TOKEN = "Yoma_Fleet_access_token";
const REFRESH_TOKEN = "Yoma_Fleet_refresh_token";
const ID_TOKEN = "Yoma_Fleet_id_token";
const IS_LOGGED_IN_KEY = "Yoma_Fleet__JYU^E^WE&E";
const IS_LOGGED_IN_VALUE = "fd44adYnj544(^5q43)933b763c7049ea844b5";

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
 * parse query value from given  string
 *
 * @param queryString string
 * @returns AuthenticationResult
 */
const parseQuery = (queryString) => {
    if (queryString.indexOf("#") > -1) {
        queryString = queryString.substr(0, queryString.indexOf("#"));
    }
    const queryParams = queryString.split("&");
    const parsedQuery = {};
    queryParams.forEach((qp) => {
        const [key, val] = qp.split("=");
        parsedQuery[key] = decodeURIComponent(val);
    });
    if (parsedQuery.expires_in) {
        parsedQuery.expires_in = parseInt(parsedQuery.expires_in);
    }
    return parsedQuery;
};

class SSOClient {
    constructor(options) {
        this.options = options;
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
            scope: "aws.cognito.signin.user.admin+email+openid+profile",
            redirect_uri: this.getRedirectUri(),
        });
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
     * @param code string
     * @return Promise<void>
     */
    handleRedirectCallback(code) {
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
            });
        });
    }
    /**
     * handle to save session to storage
     *
     * @param param0 TokenResult
     */
    saveSession({ id_token, access_token, refresh_token, }) {
        window.localStorage.setItem(ID_TOKEN, id_token);
        window.localStorage.setItem(ACCESS_TOKEN, access_token);
        window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
        api.set(IS_LOGGED_IN_KEY, IS_LOGGED_IN_VALUE);
    }
    /**
     * parse auth user from id_token
     *
     * @returns Promise<User>
     */
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(o(window.localStorage.getItem(ID_TOKEN)));
        });
    }
    checkSession() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
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
     * base url
     *
     * @param path string
     * @returns string
     */
    _url(path) {
        return `https://${this.getDomain()}/${path}`;
    }
    /**
     *
     */
    loginWithRedirect() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildAuthorizeUrl();
            window.location.assign(url);
        });
    }
    /**
     * clear session  from storage
     *
     * @reutrn void
     */
    clearSession() {
        window.localStorage.removeItem(ID_TOKEN);
        window.localStorage.removeItem(ACCESS_TOKEN);
        window.localStorage.removeItem(REFRESH_TOKEN);
        api.remove(IS_LOGGED_IN_KEY);
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
                logout_uri: window.location.origin,
                client_id: this.getClientId(),
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

const SSOProvider = ({ domain, clientId, redirectUri, onRedirectCalbck, children, }) => {
    const didInitialise = useRef(false);
    const [state, dispatch] = useReducer(reducer, initialAuthState);
    const [client] = useState(() => new SSOClient({
        domain,
        client_id: clientId,
        redirect_uri: redirectUri,
    }));
    useEffect(() => {
        if (didInitialise.current)
            return;
        didInitialise.current = true;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let user;
                if (hasAuthParams()) {
                    const queryStringFragments = window.location.href.split("?").slice(1);
                    if (queryStringFragments.length === 0)
                        throw new Error("There are no query params available for parsing.");
                    const { code } = parseQuery(queryStringFragments.join(""));
                    if (code)
                        yield client.handleRedirectCallback(code);
                    user = yield client.getUser();
                    onRedirectCalbck(user);
                }
                else {
                    user = yield client.getUser();
                }
                dispatch({ type: "INITIALISED", user });
            }
            catch (error) {
                console.log(error);
                dispatch({ type: "ERROR", error: new Error("Login Error") });
            }
        }))();
    }, [client, onRedirectCalbck]);
    const loginWithRedirect = useCallback(() => client.loginWithRedirect(), [client]);
    const logout = useCallback(() => client.logout(), [client]);
    const contextValue = useMemo(() => (Object.assign(Object.assign({}, state), { loginWithRedirect, logout })), [state, loginWithRedirect, logout]);
    return (jsx(SSOContext.Provider, Object.assign({ value: contextValue }, { children: children })));
};

export { SSOProvider, useAuth };
//# sourceMappingURL=index.esm.js.map
