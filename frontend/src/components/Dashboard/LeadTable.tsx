import React from 'react';
import { Lead } from '../../types/lead';
import { useTheme } from '../../context/ThemeContext';

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onView,
  onEdit,
  onDelete,
  isAdmin,
  isLoading
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className={`rounded-2xl border p-12 text-center backdrop-blur-sm theme-transition ${
        dark
          ? 'bg-slate-800/40 border-slate-700/50'
          : 'bg-white/70 border-gray-200/60 shadow-sm'
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
          dark ? 'bg-slate-700/50 border-slate-600/50' : 'bg-gray-100 border-gray-200'
        }`}>
          <svg className={`w-8 h-8 ${dark ? 'text-slate-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p className={`font-medium ${dark ? 'text-slate-300' : 'text-gray-600'}`}>No leads found</p>
        <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your filters or add a new lead.</p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'New': dark
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        : 'bg-blue-50 text-blue-700 border-blue-200',
      'Contacted': dark
        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        : 'bg-amber-50 text-amber-700 border-amber-200',
      'Qualified': dark
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Lost': dark
        ? 'bg-red-500/10 text-red-400 border-red-500/20'
        : 'bg-red-50 text-red-700 border-red-200'
    };
    return styles[status] || (dark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-gray-50 text-gray-600 border-gray-200');
  };

  const getSourceStyle = (source: string) => {
    const styles: Record<string, string> = {
      'Website': dark
        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        : 'bg-purple-50 text-purple-700 border-purple-200',
      'Instagram': dark
        ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
        : 'bg-pink-50 text-pink-700 border-pink-200',
      'Referral': dark
        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return styles[source] || (dark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-gray-50 text-gray-600 border-gray-200');
  };

  return (
    <div className={`rounded-2xl border overflow-hidden backdrop-blur-sm shadow-xl theme-transition ${
      dark
        ? 'bg-slate-800/40 border-slate-700/50 shadow-black/20'
        : 'bg-white/80 border-gray-200/60 shadow-gray-200/30'
    }`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${dark ? 'divide-slate-700/50' : 'divide-gray-200'}`}>
          <thead className={dark ? 'bg-slate-800/80' : 'bg-gray-50/80'}>
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((header, i) => (
                <th key={header} className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  i === 5 ? 'text-right' : 'text-left'
                } ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y bg-transparent ${dark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
            {leads.map((lead) => (
              <tr key={lead._id} className={`transition-colors ${
                dark ? 'hover:bg-slate-700/30' : 'hover:bg-blue-50/50'
              }`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                  <button
                    type="button"
                    onClick={() => onView(lead)}
                    className="text-left hover:text-blue-500 transition-colors"
                  >
                    {lead.name}
                  </button>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-slate-300' : 'text-gray-600'}`}>{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getSourceStyle(lead.source)}`}>
                    {lead.source}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                  <button
                    type="button"
                    onClick={() => onView(lead)}
                    className={`font-medium transition-colors ${
                      dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDelete(lead._id)}
                      className="text-red-500 hover:text-red-400 font-medium transition-colors"
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
    </div>
  );
};

export default LeadTable;
