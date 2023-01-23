export declare const hasAuthParams: (searchParams?: string) => boolean;
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
export declare const createQueryParams: (params: any) => string;
/**
 * parse query value from given  string
 *
 * @param queryString string
 * @returns AuthenticationResult
 */
export declare const parseQuery: (queryString: string) => AuthenticationResult;
/**
 * parse authentication result
 *
 * @param queryString string
 * @returns AuthenticationResult
 */
export declare const parseAuthenticationResult: (queryString: string) => AuthenticationResult;
