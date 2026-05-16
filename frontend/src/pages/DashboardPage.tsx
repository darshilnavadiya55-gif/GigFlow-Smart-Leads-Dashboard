import React, { useEffect, useState } from 'react';
import Navbar from '../components/Common/Navbar';
import FilterPanel from '../components/Dashboard/FilterPanel';
import LeadTable from '../components/Dashboard/LeadTable';
import LeadForm from '../components/Dashboard/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { exportLeadsToCSV } from '../utils/csvExport';
import { FilterParams, Lead } from '../types/lead';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setEditingLead(undefined);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Add New Lead
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
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
          <>
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
              <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <span className="text-sm text-gray-600">
                  Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} total records)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
