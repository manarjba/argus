import React from 'react';
import { Article } from '../services/api';

interface ThreatCardProps {
  article: Article;
}

const ThreatCard: React.FC<ThreatCardProps> = ({ article }) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getThreatTypeColor = (threatType?: string) => {
    const colors: Record<string, string> = {
      ransomware: 'bg-purple-100 text-purple-800',
      phishing: 'bg-blue-100 text-blue-800',
      vulnerability: 'bg-orange-100 text-orange-800',
      'zero-day': 'bg-red-100 text-red-800',
      apt: 'bg-pink-100 text-pink-800',
      malware: 'bg-indigo-100 text-indigo-800',
      ddos: 'bg-teal-100 text-teal-800',
      'data-breach': 'bg-cyan-100 text-cyan-800',
    };
    return threatType ? colors[threatType] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">{article.title}</h3>
        <div className="flex space-x-2 flex-shrink-0">
          {article.threat_type && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatTypeColor(article.threat_type)}`}>
              {article.threat_type}
            </span>
          )}
          {article.severity && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(article.severity)}`}>
              {article.severity}
            </span>
          )}
        </div>
      </div>

      {/* Source & Date */}
      <div className="mb-3 text-sm text-gray-600 space-y-1">
        <div>
          <span className="font-medium">Source:</span> {article.source || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Published:</span> {article.published_date ? new Date(article.published_date).toLocaleDateString() : 'Unknown'}
        </div>
      </div>

      {/* Summary */}
      {article.summary && article.summary !== "Content too short for meaningful summary" && (
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">{article.summary}</p>
      )}

      {/* Indicators of Compromise */}
      {article.iocs && Object.keys(article.iocs).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Indicators of Compromise:</h4>
          <div className="space-y-1">
            {Object.entries(article.iocs).map(([type, indicators]) => (
              <div key={type} className="flex items-center text-xs">
                <span className="font-medium text-gray-600 w-20 capitalize">{type}:</span>
                <span className="text-gray-800">
                  {(indicators as string[]).slice(0, 3).join(', ')}
                  {(indicators as string[]).length > 3 && ` ... (+${(indicators as string[]).length - 3} more)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read original article →
        </a>
        <span className="text-gray-500">ID: {article.id}</span>
      </div>
    </div>
  );
};

// ضمان أن الملف يعتبر module لتجنب TS1208
export default ThreatCard;
export {};
