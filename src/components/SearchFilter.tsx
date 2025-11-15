import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedThreatType: string;
  onThreatTypeChange: (type: string) => void;
  selectedSeverity: string;
  onSeverityChange: (severity: string) => void;
  onClearFilters: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedThreatType,
  onThreatTypeChange,
  selectedSeverity,
  onSeverityChange,
  onClearFilters
}) => {
  const threatTypes = ['all', 'ransomware', 'phishing', 'vulnerability', 'zero-day', 'apt', 'malware', 'ddos', 'data-breach', 'other'];
  const severityLevels = ['all', 'critical', 'high', 'medium', 'low', 'informational'];

  const hasActiveFilters = searchTerm || selectedThreatType !== 'all' || selectedSeverity !== 'all';

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Threats</label>
          <input
            type="text"
            placeholder="Search by title, content, or source..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Threat Type</label>
          <select
            value={selectedThreatType}
            onChange={e => onThreatTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {threatTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <select
            value={selectedSeverity}
            onChange={e => onSeverityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {severityLevels.map(severity => (
              <option key={severity} value={severity}>
                {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
