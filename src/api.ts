import { createQueryParams } from "./utils/utils";

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

export const oauthToken = async ({
  baseUrl,
  grant_type,
  client_id,
  code,
  redirect_uri,
}: OauthTokenProps): Promise<TokenResult | undefined> => {
  try {
    const res = await fetch(
      `${baseUrl}/oauth2/token?${createQueryParams({
        grant_type,
        client_id,
        code,
        redirect_uri,
      })}`
    );
    if (!res.ok) {
      throw new Error("Error");
    }
    const data = await res.json();
    if (data?.data) {
      return data?.data as TokenResult;
    }
  } catch (error) {
    throw new Error("Error");
  }
};
