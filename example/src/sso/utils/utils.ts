const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

export interface AuthenticationResult {
  state: string;
  code?: string;
  error?: string;
  error_description?: string;
}

/**
 * create query params from object
 *
 * @param params any
 * @returns string
 */
export const createQueryParams = (params: any) =>
  Object.keys(params)
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
export const parseQuery = (queryString: string): AuthenticationResult => {
  if (queryString.indexOf("#") > -1) {
    queryString = queryString.substr(0, queryString.indexOf("#"));
  }
  const queryParams = queryString.split("&");
  const parsedQuery: Record<string, any> = {};
  queryParams.forEach((qp) => {
    const [key, val] = qp.split("=");
    parsedQuery[key] = decodeURIComponent(val);
  });
  if (parsedQuery.expires_in) {
    parsedQuery.expires_in = parseInt(parsedQuery.expires_in);
  }
  return parsedQuery as AuthenticationResult;
};

/**
 * parse authentication result
 *
 * @param queryString string
 * @returns AuthenticationResult
 */
export const parseAuthenticationResult = (
  queryString: string
): AuthenticationResult => {
  if (queryString.indexOf("#") > -1)
    queryString = queryString.substring(0, queryString.indexOf("#"));
  const searchParams = new URLSearchParams(queryString);
  return {
    state: searchParams.get("state")!,
    code: searchParams.get("code") || undefined,
    error: searchParams.get("error") || undefined,
    error_description: searchParams.get("error_description") || undefined,
  };
};
