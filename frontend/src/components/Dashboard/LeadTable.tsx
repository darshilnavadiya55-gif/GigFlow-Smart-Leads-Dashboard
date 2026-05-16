import React from 'react';
import { Lead } from '../../types/lead';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onEdit,
  onDelete,
  isAdmin,
  isLoading
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Qualified':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Website':
        return 'bg-purple-100 text-purple-800';
      case 'Instagram':
        return 'bg-pink-100 text-pink-800';
      case 'Referral':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No leads found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Source
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Created
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getSourceColor(
                    lead.source
                  )}`}
                >
                  {lead.source}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
