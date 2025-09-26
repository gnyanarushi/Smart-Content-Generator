import React, { useState, useEffect } from 'react';
import { contentService, API_BASE_URL } from '@/services/api';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    health?: any;
    contents?: any;
    error?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults({});

    try {
      console.log('🧪 Running API tests...');
      
      // Test 1: Health check
      try {
        const healthCheck = await contentService.healthCheck();
        setTestResults(prev => ({ ...prev, health: healthCheck }));
        console.log('✅ Health check:', healthCheck);
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setTestResults(prev => ({ ...prev, health: { status: 'error', message: `Health check failed: ${error}` } }));
      }

      // Test 2: Get contents
      try {
        const contents = await contentService.getAllContents();
        setTestResults(prev => ({ ...prev, contents: { status: 'success', count: contents.length } }));
        console.log('✅ Get contents:', contents.length, 'items');
      } catch (error: any) {
        console.error('❌ Get contents failed:', error);
        setTestResults(prev => ({ 
          ...prev, 
          contents: { 
            status: 'error', 
            message: `${error.response?.status || 'Network'} - ${error.response?.statusText || error.message}`
          } 
        }));
      }
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      setTestResults({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🧪 API Test Results</h3>
      
      <div className="text-xs space-y-2">
        <div>
          <strong>Base URL:</strong> <code className="bg-gray-100 px-1 rounded">{API_BASE_URL}</code>
        </div>
        
        <div>
          <strong>Health Check:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            testResults.health?.status === 'success' ? 'bg-green-100 text-green-700' : 
            testResults.health?.status === 'error' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100'
          }`}>
            {testResults.health?.status || 'Testing...'}
          </span>
        </div>
        
        <div>
          <strong>Get Contents:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            testResults.contents?.status === 'success' ? 'bg-green-100 text-green-700' : 
            testResults.contents?.status === 'error' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100'
          }`}>
            {testResults.contents?.status === 'success' ? 
              `✅ ${testResults.contents.count} items` : 
              testResults.contents?.message || 'Testing...'
            }
          </span>
        </div>
        
        {testResults.error && (
          <div className="text-red-600 text-xs">
            <strong>Error:</strong> {testResults.error}
          </div>
        )}
      </div>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Tests Again'}
      </button>
    </div>
  );
};

export default ApiTest;