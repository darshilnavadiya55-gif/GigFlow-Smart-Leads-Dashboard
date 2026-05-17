import React, { useEffect, useState } from 'react';
import { Lead } from '../../types/lead';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

interface LeadModalProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const LeadModal: React.FC<LeadModalProps> = ({
  leadId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !leadId) {
      setLead(null);
      setError(null);
      return;
    }

    const fetchLead = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getSingleLead(leadId);
        if (response.data) {
          setLead(response.data);
        } else {
          setError('Lead not found');
        }
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to load lead details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [isOpen, leadId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      New: dark
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        : 'bg-blue-50 text-blue-700 border-blue-200',
      Contacted: dark
        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        : 'bg-amber-50 text-amber-700 border-amber-200',
      Qualified: dark
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Lost: dark
        ? 'bg-red-500/10 text-red-400 border-red-500/20'
        : 'bg-red-50 text-red-700 border-red-200'
    };
    return styles[status] || (dark ? 'bg-slate-500/10 text-slate-400' : 'bg-gray-50 text-gray-600');
  };

  const getSourceStyle = (source: string) => {
    const styles: Record<string, string> = {
      Website: dark
        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        : 'bg-purple-50 text-purple-700 border-purple-200',
      Instagram: dark
        ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
        : 'bg-pink-50 text-pink-700 border-pink-200',
      Referral: dark
        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return styles[source] || (dark ? 'bg-slate-500/10 text-slate-400' : 'bg-gray-50 text-gray-600');
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

  const divider = dark ? 'border-slate-700/50' : 'border-gray-100';
  const labelClass = `text-xs font-medium uppercase tracking-wider mb-1.5 ${dark ? 'text-slate-500' : 'text-gray-400'}`;
  const valueClass = `text-sm font-medium ${dark ? 'text-slate-100' : 'text-gray-900'}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl theme-transition ${
          dark
            ? 'bg-slate-800 border-slate-700/50 shadow-black/40'
            : 'bg-white border-gray-200 shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            dark ? 'border-slate-700/50' : 'border-gray-200'
          }`}
        >
          <h2
            id="lead-modal-title"
            className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}
          >
            Lead Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              dark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-2 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {error && !isLoading && (
            <div className="py-8 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {lead && !isLoading && (
            <dl className={divider}>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Name</dt>
                <dd className={valueClass}>{lead.name}</dd>
              </div>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Email</dt>
                <dd className={valueClass}>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {lead.email}
                  </a>
                </dd>
              </div>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Status</dt>
                <dd>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)}`}
                  >
                    {lead.status}
                  </span>
                </dd>
              </div>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Source</dt>
                <dd>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getSourceStyle(lead.source)}`}
                  >
                    {lead.source}
                  </span>
                </dd>
              </div>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Created</dt>
                <dd className={valueClass}>{formatDate(lead.createdAt)}</dd>
              </div>
              <div className={`py-4 border-b ${divider}`}>
                <dt className={labelClass}>Last Updated</dt>
                <dd className={valueClass}>{formatDate(lead.updatedAt)}</dd>
              </div>
              <div className="py-4">
                <dt className={labelClass}>Lead ID</dt>
                <dd className={`font-mono text-xs break-all ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {lead._id}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {lead && !isLoading && (
          <div
            className={`flex gap-3 px-6 py-4 border-t ${
              dark ? 'border-slate-700/50' : 'border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-medium border transition-colors ${
                dark
                  ? 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(lead);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Edit
            </button>
            {isAdmin && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(lead._id);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl font-medium text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadModal;
