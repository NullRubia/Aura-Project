'use client';

import { useEffect } from 'react';

export default function KakaoRedirect() {
  useEffect(() => {
    const clientId = 'e50fd013f4882d61b912a5d3eac780c5';
    const redirectUri = 'http://localhost:3000/oauth/callback';
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    window.location.href = url;
  }, []);

  return null;
}


