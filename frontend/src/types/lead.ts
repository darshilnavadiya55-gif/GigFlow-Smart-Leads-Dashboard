export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {}

export interface FilterParams {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
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
  data: Lead[];
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
