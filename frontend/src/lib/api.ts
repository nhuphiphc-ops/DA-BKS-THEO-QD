const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://da-bks-theo-qd.onrender.com';

const getHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bks_token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bks_token');
      window.location.href = '/';
    }
    throw new Error('Phien dang nhap da het han. Vui long dang nhap lai.');
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = Array.isArray(errBody.message)
      ? errBody.message.join(', ')
      : (errBody.message || 'Loi may chu ' + res.status);
    throw new Error(msg);
  }
  return res.json();
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(API_URL + endpoint, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  post: async (endpoint: string, data: any) => {
    const res = await fetch(API_URL + endpoint, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  put: async (endpoint: string, data: any) => {
    const res = await fetch(API_URL + endpoint, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (endpoint: string) => {
    const res = await fetch(API_URL + endpoint, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
