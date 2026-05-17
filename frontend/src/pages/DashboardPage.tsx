import React, { useEffect, useState } from 'react';
import Navbar from '../components/Common/Navbar';
import FilterPanel from '../components/Dashboard/FilterPanel';
import LeadTable from '../components/Dashboard/LeadTable';
import LeadForm from '../components/Dashboard/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { exportLeadsToCSV } from '../utils/csvExport';
import api from '../services/api';
import { FilterParams, Lead } from '../types/lead';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const {
    leads,
    pagination,
    isLoading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead
  } = useLeads();

  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    sortBy: 'latest'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchLeads({ ...filters, search: debouncedSearch });
  }, [filters, debouncedSearch, fetchLeads]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleCreateOrUpdate = async (data: any) => {
    if (editingLead) {
      await updateLead(editingLead._id, data);
    } else {
      await createLead(data);
    }
    setShowForm(false);
    setEditingLead(undefined);
    // Refetch to maintain order and pagination
    fetchLeads({ ...filters, search: debouncedSearch });
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
      fetchLeads({ ...filters, search: debouncedSearch });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      // Fetch all matching leads without pagination limit (e.g. limit: 10000)
      const response = await api.getLeads({
        ...filters,
        search: debouncedSearch,
        page: 1,
        limit: 10000
      });
      if (response.data && response.data.length > 0) {
        exportLeadsToCSV(response.data);
      } else {
        alert('No leads found to export.');
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export leads.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`min-h-screen theme-transition ${
      dark ? 'bg-[#0f172a] text-slate-200' : 'bg-gray-50 text-gray-800'
    }`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex justify-between items-center mb-8 p-6 rounded-2xl border backdrop-blur-sm theme-transition ${
          dark
            ? 'bg-slate-800/30 border-slate-700/50'
            : 'bg-white/60 border-gray-200/60 shadow-sm'
        }`}>
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Leads Dashboard</h1>
            <p className={`mt-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Manage and track your leads efficiently.</p>
          </div>
          <div className="flex gap-4">
            {user?.role === 'admin' && (
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border disabled:opacity-50 ${
                  dark
                    ? 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-600/30'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                {isExporting ? (
                  <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                )}
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            )}
            <button
              onClick={() => {
                setEditingLead(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add New Lead
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start text-sm">
            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        {showForm ? (
          <div className="mb-8">
            <LeadForm
              lead={editingLead}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setShowForm(false);
                setEditingLead(undefined);
              }}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />

            <LeadTable
              leads={leads}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={user?.role === 'admin'}
              isLoading={isLoading}
            />
            
            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className={`mt-6 flex justify-between items-center p-4 rounded-xl border backdrop-blur-sm theme-transition ${
                dark
                  ? 'bg-slate-800/50 border-slate-700/50'
                  : 'bg-white/70 border-gray-200/60 shadow-sm'
              }`}>
                <span className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Showing page <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{pagination.currentPage}</span> of <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{pagination.totalPages}</span> ({pagination.totalRecords} total records)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className={`px-4 py-2 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium ${
                      dark
                        ? 'border-slate-600 hover:bg-slate-700'
                        : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className={`px-4 py-2 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium ${
                      dark
                        ? 'border-slate-600 hover:bg-slate-700'
                        : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
