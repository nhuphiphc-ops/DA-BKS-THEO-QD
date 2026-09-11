const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://da-bks-theo-qd.onrender.com';

const getHeaders = () => {
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bks_token');
    if (token) {
      headers = { ...headers, 'Authorization': 'Bearer ' + token };
    }
  }

  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  
  delete: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }
};
