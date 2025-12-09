/**
 * API Service Layer - Frontend'den backend'e güvenli bağlantı
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Token varsa header'a ekle
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // 401 Unauthorized - Token geçersiz veya süresi dolmuş
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/#login';
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network hatası. Lütfen internet bağlantınızı kontrol edin.');
    }
  }

  // Email Aktivasyon - Kod gönder
  async sendVerificationCode(
    email: string,
    password: string,
    name: string,
    phone?: string
  ) {
    return this.request('/auth/send-verification-code', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }

  // Email Aktivasyon - Kodu doğrula ve kayıt tamamla
  async verifyAndRegister(
    email: string,
    code: string,
    password: string,
    name: string,
    phone?: string
  ) {
    const response = await this.request<{ token: string; user: any }>(
      '/auth/verify-and-register',
      {
        method: 'POST',
        body: JSON.stringify({ email, code, password, name, phone }),
      }
    );

    // Backend direkt token ve user döndürüyor
    if (response.success && (response as any).token) {
      localStorage.setItem('token', (response as any).token);
    }

    return response;
  }

  // Eski register metodu (artık kullanılmıyor, aktivasyon sistemi var)
  async register(email: string, password: string, name: string, phone?: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });

    // Backend direkt token ve user döndürüyor (data wrapper yok)
    if (response.success && (response as any).token) {
      localStorage.setItem('token', (response as any).token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Backend direkt token ve user döndürüyor (data wrapper yok)
    if (response.success && (response as any).token) {
      localStorage.setItem('token', (response as any).token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  // Token kontrolü
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiService = new ApiService();

