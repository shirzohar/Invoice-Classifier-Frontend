// src/utils/fetchWithAuth.ts
export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = localStorage.getItem('token');
  
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  
    return fetch(url, {
      ...options,
      headers,
    });
  }
  