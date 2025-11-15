import React, { useState, useEffect, useMemo } from 'react';
import { Article, SystemStatus, BatchStats, argusApi } from '../services/api';
import ThreatCard from './ThreatCard';
import SearchFilter from './SearchFilter';

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [batchStats, setBatchStats] = useState<BatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreatType, setSelectedThreatType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Filter articles based on search and filters
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const searchMatch =
        searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()));

      const typeMatch = selectedThreatType === 'all' || article.threat_type === selectedThreatType;
      const severityMatch = selectedSeverity === 'all' || article.severity === selectedSeverity;

      return searchMatch && typeMatch && severityMatch;
    });
  }, [articles, searchTerm, selectedThreatType, selectedSeverity]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [articlesData, statusData, statsData] = await Promise.all([
        argusApi.getArticles().catch(err => {
          console.error('Failed to load articles:', err);
          setError('Failed to load articles from API');
          return [];
        }),
        argusApi.getSystemStatus(),
        argusApi.getBatchStats()
      ]);

      setArticles(articlesData);
      setSystemStatus(statusData);
      setBatchStats(statsData);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchArticles = async () => {
    try {
      setRefreshing(true);
      await argusApi.fetchArticles();
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to fetch new articles');
    } finally {
      setRefreshing(false);
    }
  };

  const handleProcessAll = async () => {
    try {
      setRefreshing(true);
      await argusApi.processAllArticles();
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to process articles');
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedThreatType('all');
    setSelectedSeverity('all');
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Argus Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Argus Cybersecurity</h1>
            <p className="text-sm text-gray-600">Threat Intelligence Dashboard</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleFetchArticles}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {refreshing ? 'Fetching...' : 'Fetch New Articles'}
            </button>
            <button
              onClick={handleProcessAll}
              disabled={refreshing}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {refreshing ? 'Processing...' : 'Process All'}
            </button>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Articles</h3>
          <p className="text-3xl font-bold text-blue-600">{filteredArticles.length}</p>
          <p className="text-sm text-gray-600 mt-1">
            {filteredArticles.length === articles.length
              ? 'Total threats'
              : `${filteredArticles.length} of ${articles.length} filtered`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processing</h3>
          <p className="text-3xl font-bold text-green-600">{batchStats?.processing_percentage || 0}%</p>
          <p className="text-sm text-gray-600 mt-1">{batchStats?.processed_articles || 0} articles analyzed</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">IOCs Found</h3>
          <p className="text-3xl font-bold text-orange-600">{batchStats?.articles_with_iocs || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Articles with indicators</p>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedThreatType={selectedThreatType}
        onThreatTypeChange={setSelectedThreatType}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        onClearFilters={handleClearFilters}
      />

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {articles.length === 0
              ? 'No articles found. Click "Fetch New Articles".'
              : 'No threats match your filters.'}
            {(searchTerm || selectedThreatType !== 'all' || selectedSeverity !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ThreatCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
