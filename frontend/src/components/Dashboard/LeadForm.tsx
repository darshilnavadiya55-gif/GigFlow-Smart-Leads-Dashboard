import React, { useState } from 'react';
import { Lead, CreateLeadRequest } from '../../types/lead';
import { useTheme } from '../../context/ThemeContext';

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: CreateLeadRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, onCancel, isLoading }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [formData, setFormData] = useState<CreateLeadRequest>(
    lead
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source
        }
      : {
          name: '',
          email: '',
          status: 'New',
          source: 'Website'
        }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const formErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
    }

    if (!formData.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      formErrors.email = 'Valid email is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled in parent
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
      dark ? 'bg-slate-900/50 text-slate-200 placeholder-slate-500' : 'bg-gray-50 text-gray-900 placeholder-gray-400'
    } ${hasError
      ? 'border-red-500/50 focus:border-red-500/50'
      : dark ? 'border-slate-700/50 focus:border-blue-500/50' : 'border-gray-200 focus:border-blue-500/50'
    }`;

  const selectClass = `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none pr-10 ${
    dark
      ? 'bg-slate-900/50 border-slate-700/50 text-slate-200'
      : 'bg-gray-50 border-gray-200 text-gray-800'
  }`;

  const optionClass = dark ? 'bg-slate-800' : 'bg-white';

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl border p-8 backdrop-blur-sm shadow-xl theme-transition ${
      dark
        ? 'bg-slate-800/40 border-slate-700/50 shadow-black/20'
        : 'bg-white/80 border-gray-200/60 shadow-gray-200/30'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </div>
        <h3 className={`text-xl font-bold tracking-wide ${dark ? 'text-white' : 'text-gray-900'}`}>
          {lead ? 'Edit Lead Details' : 'Create New Lead'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass(!!errors.name)}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass(!!errors.email)}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
        </div>

        {/* Status */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Status
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'New' | 'Contacted' | 'Qualified' | 'Lost'
                })
              }
              className={selectClass}
            >
              <option value="New" className={optionClass}>New</option>
              <option value="Contacted" className={optionClass}>Contacted</option>
              <option value="Qualified" className={optionClass}>Qualified</option>
              <option value="Lost" className={optionClass}>Lost</option>
            </select>
            <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Source */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Source
          </label>
          <div className="relative">
            <select
              value={formData.source}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  source: e.target.value as 'Website' | 'Instagram' | 'Referral'
                })
              }
              className={selectClass}
            >
              <option value="Website" className={optionClass}>Website</option>
              <option value="Instagram" className={optionClass}>Instagram</option>
              <option value="Referral" className={optionClass}>Referral</option>
            </select>
            <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex gap-4 mt-8 pt-6 border-t ${dark ? 'border-slate-700/50' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 font-medium py-3 rounded-xl border transition-colors ${
            dark
              ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Saving...' : lead ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
