'use client';

import { useEffect } from 'react';

export default function GoogleRedirect() {
  useEffect(() => {
    const clientId = '645950295934-thh6poh11vnd5vra8mda15jr98iajcvd.apps.googleusercontent.com';
    const redirectUri = 'http://localhost'; // implicit flow
    const scope = 'openid email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
  }, []);

  return null;
}


