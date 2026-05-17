import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { LeadsResponse, Lead, CreateLeadRequest } from '../types/lead';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add token to requests
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Only redirect to login if 401 is from a protected route, NOT from the login endpoint itself
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>(
      '/auth/register',
      data
    );
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>(
      '/auth/login',
      data
    );
    return response.data;
  }

  // Lead endpoints
  async getLeads(params?: {
    page?: number;
    limit?: number;
    status?: string;
    source?: string;
    search?: string;
    sortBy?: 'latest' | 'oldest';
  }): Promise<LeadsResponse> {
    const response = await this.axiosInstance.get<LeadsResponse>(
      '/leads',
      { params }
    );
    return response.data;
  }

  async getSingleLead(id: string) {
    const response = await this.axiosInstance.get<{
      success: boolean;
      statusCode: number;
      message: string;
      data: Lead;
    }>(`/leads/${id}`);
    return response.data;
  }

  async createLead(data: CreateLeadRequest): Promise<{ data: Lead }> {
    const response = await this.axiosInstance.post<{ data: Lead }>(
      '/leads',
      data
    );
    return response.data;
  }

  async updateLead(id: string, data: Partial<CreateLeadRequest>) {
    const response = await this.axiosInstance.put(
      `/leads/${id}`,
      data
    );
    return response.data;
  }

  async deleteLead(id: string) {
    const response = await this.axiosInstance.delete(
      `/leads/${id}`
    );
    return response.data;
  }
}

export default new ApiService();
