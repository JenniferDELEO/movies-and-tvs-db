import { AccountDetail } from "@/models/user";

export const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  },
};

export async function getRequestToken(): Promise<{
  success: boolean;
  expires_at: string;
  request_token: string;
}> {
  const optionsPOST = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
    body: JSON.stringify({
      redirect_to: `${process.env.NEXT_PUBLIC_URL}`,
    }),
  };
  try {
    const responseRequestToken = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_API_URL_V4}/auth/request_token`,
      optionsPOST
    );
    const responseJsonRequestToken = await responseRequestToken.json();
    localStorage.setItem(
      "request_token",
      responseJsonRequestToken.request_token
    );
    return responseJsonRequestToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAccessToken(requestToken: string): Promise<{
  access_token: string;
  account_id: string;
  status_code: number;
  status_message: string;
  success: boolean;
}> {
  const optionsPOST = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
    body: JSON.stringify({
      request_token: requestToken,
    }),
  };
  try {
    const responseAccessToken = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_API_URL_V4}/auth/access_token`,
      optionsPOST
    );
    const responseJsonAccessToken = await responseAccessToken.json();
    localStorage.setItem("account_id_v4", responseJsonAccessToken.account_id);
    localStorage.setItem("access_token", responseJsonAccessToken.access_token);
    localStorage.removeItem("request_token");
    return responseJsonAccessToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createSessionFromV4(accessToken: string): Promise<{
  success: boolean;
  session_id: string;
}> {
  const optionsPOST = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  };
  try {
    const responseCreateSession = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_API_URL_V3}/authentication/session/convert/4`,
      optionsPOST
    );
    const responseJsonCreateSession = await responseCreateSession.json();
    localStorage.setItem("session_id", responseJsonCreateSession.session_id);
    return responseJsonCreateSession;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAccountDetails(
  sessionId: string
): Promise<AccountDetail> {
  try {
    const responseFetchAccount = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_API_URL_V3}/account?session_id=${sessionId}`,
      optionsGET
    );
    const responseJsonAccount = await responseFetchAccount.json();
    localStorage.setItem("account_id_v3", responseJsonAccount.id);
    localStorage.setItem("account_username", responseJsonAccount.username);
    return responseJsonAccount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
