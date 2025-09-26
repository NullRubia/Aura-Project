'use client';

import { useEffect } from 'react';

export default function NaverRedirect() {
  useEffect(() => {
    const clientId = 'pKYAlNSquOnF0t7lJp1G';
    const redirectUri = 'http://localhost'; // implicit flow
    const state = 'TEST';
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;
    window.location.href = url;
  }, []);

  return null;
}


