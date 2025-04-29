const API_BASE_URL = window.location.hostname.includes('localhost')
  ? 'https://localhost:7129'
  : 'https://busymatch-backend.onrender.com';

export { API_BASE_URL };

// Utility function for making authenticated fetch requests
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get JWT token from local storage
  const token = localStorage.getItem('token');

  // Merge provided headers with Authorization header
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Perform the actual fetch call with the modified headers
  return fetch(url, {
    ...options,
    headers,
  });
}
