interface OauthTokenProps {
    baseUrl: string;
    grant_type: string;
    client_id: string;
    code: string;
    redirect_uri: string;
}
export interface TokenResult {
    access_token: string;
    id_token: string;
    refresh_token: string;
}
/**
 * request oauth token `domain/oauth2/token`
 *
 * @param param0 OauthTokenProps
 * @returns Promise<TokenResult>
 */
export declare const oauthToken: ({ baseUrl, grant_type, client_id, code, redirect_uri, }: OauthTokenProps) => Promise<TokenResult>;
/**
 * request oauth token `domain/oauth2/token`
 *
 * @param param0 OauthTokenProps
 * @returns Promise<TokenResult>
 */
export declare const refreshToken: ({ baseUrl, client_id, refresh_token, }: any) => Promise<TokenResult>;
export {};
