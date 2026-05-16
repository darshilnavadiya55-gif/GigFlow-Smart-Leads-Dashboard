import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { Lead, FilterParams, PaginationMeta, LeadsResponse } from '../types/lead';
import { useAuth } from './useAuth';

export const useLeads = () => {
  const { isAuthenticated } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    recordsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(
    async (filters?: FilterParams) => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const response: LeadsResponse = await api.getLeads(filters);

        if (response.success) {
          setLeads(response.data);
          setPagination(response.pagination);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch leads';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const createLead = useCallback(
    async (data: any) => {
      try {
        const response = await api.createLead(data);
        if (response.data) {
          setLeads((prev) => [response.data, ...prev]);
          return response.data;
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create lead';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateLead = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await api.updateLead(id, data);
        setLeads((prev) =>
          prev.map((lead) => (lead._id === id ? response.data : lead))
        );
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update lead';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteLead = useCallback(
    async (id: string) => {
      try {
        await api.deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete lead';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  return {
    leads,
    pagination,
    isLoading,
    error,
    setError,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead
  };
};
