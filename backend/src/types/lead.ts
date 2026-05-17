export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source?: 'Website' | 'Instagram' | 'Referral';
}

export interface FilterParams {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'oldest';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ILead[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string>;
}

export interface ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string>;
}
