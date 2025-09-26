const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export type Provider = "google" | "kakao" | "naver";

export interface Credentials {
  email: string; //  이메일을 그대로 사용
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string; // 'Bearer'
}

export interface MeResponse {
  email: string;
  name: string;
  phone: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface FindEmailPayload {
  phone: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  newPassword: string;
}

const AUTH_STORAGE_KEYS = {
  accessToken: "auth_access_token",
  refreshToken: "auth_refresh_token",
  tokenType: "auth_token_type",
  remember: "remember_me",
};

const saveTokens = (tokens: TokenResponse, remember: boolean) => {
  try {
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem(AUTH_STORAGE_KEYS.accessToken, tokens.accessToken);
    storage.setItem(AUTH_STORAGE_KEYS.refreshToken, tokens.refreshToken);
    if (tokens.tokenType) {
      storage.setItem(AUTH_STORAGE_KEYS.tokenType, tokens.tokenType);
    }
    // remember 플래그는 localStorage에만 저장하여 다음 세션에도 적용되도록
    window.localStorage.setItem(
      AUTH_STORAGE_KEYS.remember,
      remember ? "true" : "false"
    );
  } catch {}
};

export const getStoredAccessToken = (): string | null => {
  try {
    const remember =
      window.localStorage.getItem(AUTH_STORAGE_KEYS.remember) === "true";
    const storage = remember ? window.localStorage : window.sessionStorage;
    return storage.getItem(AUTH_STORAGE_KEYS.accessToken);
  } catch {
    return null;
  }
};

export const authService = {
  async login(
    credentials: Credentials,
    remember: boolean
  ): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("로그인 실패");
    const data: TokenResponse = await res.json();
    saveTokens(data, remember);
    return data;
  },

  async register(payload: RegisterPayload): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "회원가입 실패");
    }
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error("토큰 갱신 실패");
    const data: TokenResponse = await res.json();
    const remember =
      window.localStorage.getItem(AUTH_STORAGE_KEYS.remember) === "true";
    saveTokens(data, remember);
    return data;
  },

  async socialLogin(
    provider: Provider,
    tokenOrCode: string,
    remember: boolean
  ): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/social/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, accessToken: tokenOrCode }),
    });
    if (!res.ok) throw new Error("소셜 로그인 실패");
    const data: TokenResponse = await res.json();
    saveTokens(data, remember);
    return data;
  },

  async linkSocial(provider: Provider, tokenOrCode: string): Promise<void> {
    const accessToken = getStoredAccessToken();
    const res = await fetch(`${API_BASE_URL}/auth/social/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ provider, accessToken: tokenOrCode }),
    });
    if (!res.ok) throw new Error("소셜 계정 연동 실패");
  },

  async me(): Promise<MeResponse> {
    const accessToken = getStoredAccessToken();
    if (!accessToken) throw new Error("로그인 필요");

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error("사용자 정보 가져오기 실패");

    const data: MeResponse = await res.json();
    return data;
  },

  async updateUser(payload: UpdateUserPayload): Promise<void> {
    const accessToken = getStoredAccessToken();
    if (!accessToken) throw new Error("로그인 필요");

    const res = await fetch(`${API_BASE_URL}/auth/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "사용자 정보 업데이트 실패");
    }
  },
  async findEmail(payload: FindEmailPayload): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/auth/find-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "이메일 찾기 실패");
    }
    return res.text(); // 백엔드에서 이메일을 plain string으로 반환
  },

  async requestPasswordReset(
    payload: PasswordResetRequestPayload
  ): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/auth/password/reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "비밀번호 재설정 요청 실패");
    }
    return res.text(); // 성공 메시지 반환
  },

  async confirmPasswordReset(
    payload: PasswordResetConfirmPayload
  ): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/auth/password/reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "비밀번호 재설정 실패");
    }
    return res.text(); // 성공 메시지 반환
  },
};
