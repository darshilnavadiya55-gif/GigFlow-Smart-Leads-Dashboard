import React from 'react';
import { FilterParams } from '../../types/lead';
import { useTheme } from '../../context/ThemeContext';

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onSearch: (search: string) => void;
  searchQuery: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onSearch,
  searchQuery
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const inputClass = `w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none pr-10 ${
    dark
      ? 'bg-slate-900/50 border-slate-700/50 text-slate-200'
      : 'bg-gray-50 border-gray-200 text-gray-800'
  }`;

  const optionClass = dark ? 'bg-slate-800' : 'bg-white';

  return (
    <div className={`rounded-2xl border p-6 backdrop-blur-sm shadow-xl theme-transition ${
      dark
        ? 'bg-slate-800/40 border-slate-700/50 shadow-black/20'
        : 'bg-white/70 border-gray-200/60 shadow-gray-200/30'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
        <h3 className={`text-lg font-semibold tracking-wide ${dark ? 'text-white' : 'text-gray-900'}`}>Filters & Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`h-4 w-4 ${dark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Name or email..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${
                dark
                  ? 'bg-slate-900/50 border-slate-700/50 text-slate-200 placeholder-slate-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  status: e.target.value || undefined,
                  page: 1
                })
              }
              className={inputClass}
            >
              <option value="" className={optionClass}>All Statuses</option>
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

        {/* Source Filter */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Source
          </label>
          <div className="relative">
            <select
              value={filters.source || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  source: e.target.value || undefined,
                  page: 1
                })
              }
              className={inputClass}
            >
              <option value="" className={optionClass}>All Sources</option>
              <option value="Website" className={optionClass}>Website</option>
              <option value="Instagram" className={optionClass}>Instagram</option>
              <option value="Referral" className={optionClass}>Referral</option>
            </select>
            <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Sort
          </label>
          <div className="relative">
            <select
              value={filters.sortBy || 'latest'}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sortBy: (e.target.value as 'latest' | 'oldest') || 'latest'
                })
              }
              className={inputClass}
            >
              <option value="latest" className={optionClass}>Latest First</option>
              <option value="oldest" className={optionClass}>Oldest First</option>
            </select>
            <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
