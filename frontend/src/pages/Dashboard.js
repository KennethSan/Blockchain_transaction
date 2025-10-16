import React, { useState, useEffect } from 'react';
import { blockchainAPI, transactionAPI } from '../services/api';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [miningLog, setMiningLog] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await blockchainAPI.getStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleValidateChain = async () => {
    setLoading(true);
    try {
      const response = await blockchainAPI.validate();
      if (response.data.success) {
        setValidationStatus(response.data.is_valid);
        addLog(response.data.message);
      }
    } catch (error) {
      addLog('Error validating blockchain: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMineBlock = async () => {
    setLoading(true);
    addLog('Starting mining process...', 'info');
    
    try {
      const response = await blockchainAPI.mine();
      if (response.data.success) {
        addLog('✅ Block mined successfully!', 'success');
        addLog(`Block #${response.data.data.index_no} | Hash: ${response.data.data.current_hash.substring(0, 16)}...`, 'success');
        fetchStatistics();
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      addLog('❌ Mining failed: ' + message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setMiningLog(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setMiningLog([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Manage and monitor your blockchain</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Blocks" 
            value={statistics.total_blocks} 
            color="blue"
            icon="📦"
          />
          <StatCard 
            title="Total Transactions" 
            value={statistics.total_transactions} 
            color="purple"
            icon="💰"
          />
          <StatCard 
            title="Pending Transactions" 
            value={statistics.pending_transactions} 
            color="yellow"
            icon="⏳"
          />
          <StatCard 
            title="Blockchain Status" 
            value={statistics.is_valid ? "Valid" : "Invalid"} 
            color={statistics.is_valid ? "green" : "red"}
            icon={statistics.is_valid ? "✅" : "❌"}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleMineBlock}
            disabled={loading}
            className="px-6 py-3 bg-blockchain-blue text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? '⛏️ Mining...' : '⛏️ Mine Block'}
          </button>
          
          <button
            onClick={handleValidateChain}
            disabled={loading}
            className="px-6 py-3 bg-blockchain-green text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? '🔄 Validating...' : '🔍 Validate Chain'}
          </button>

          <button
            onClick={fetchStatistics}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            🔄 Refresh Stats
          </button>
        </div>

        {/* Validation Status */}
        {validationStatus !== null && (
          <div className={`mt-4 p-4 rounded-lg ${validationStatus ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-2`}>
            <p className={`font-semibold ${validationStatus ? 'text-green-800' : 'text-red-800'}`}>
              {validationStatus ? '✅ Blockchain is VALID - All blocks verified!' : '❌ Blockchain is INVALID - Integrity compromised!'}
            </p>
          </div>
        )}
      </div>

      {/* Mining Log */}
      {miningLog.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Activity Log</h3>
            <button
              onClick={clearLogs}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto space-y-2">
            {miningLog.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  'text-gray-300'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-md p-6 border-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default Dashboard;
