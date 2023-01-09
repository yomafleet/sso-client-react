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
export const oauthToken = async ({
  baseUrl,
  grant_type,
  client_id,
  code,
  redirect_uri,
}: OauthTokenProps): Promise<TokenResult> => {
  try {
    const res = await fetch(`${baseUrl}/oauth2/token`, {
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
    if (!res.ok) throw new Error("Error Fetching Token");
    return await res.json();
  } catch (error) {
    throw new Error("Error Fetching Token");
  }
};

/**
 * request oauth token `domain/oauth2/token`
 *
 * @param param0 OauthTokenProps
 * @returns Promise<TokenResult>
 */
export const refreshToken = async ({
  baseUrl,
  client_id,
  refresh_token,
}: any): Promise<TokenResult> => {
  try {
    const res = await fetch(`${baseUrl}/oauth2/token`, {
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
    if (!res.ok) throw new Error("Error Fetching Token");
    return await res.json();
  } catch (error) {
    throw new Error("Error Fetching Token");
  }
};
