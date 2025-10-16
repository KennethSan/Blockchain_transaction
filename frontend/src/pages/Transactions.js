import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

function Transactions() {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    amount: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      const response = await transactionAPI.getPending();
      if (response.data.success) {
        setPendingTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await transactionAPI.create(formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Transaction created successfully!' });
        setFormData({ sender: '', receiver: '', amount: '' });
        fetchPendingTransactions();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.message || error.message;
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Transactions</h2>
        <p className="text-gray-600">Create new transactions and view pending ones</p>
      </div>

      {/* Create Transaction Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Transaction</h3>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border-2 border-green-500' 
              : 'bg-red-100 text-red-800 border-2 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sender
            </label>
            <input
              type="text"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blockchain-blue focus:border-transparent"
              placeholder="Enter sender name or address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver
            </label>
            <input
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blockchain-blue focus:border-transparent"
              placeholder="Enter receiver name or address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blockchain-blue focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blockchain-blue text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Creating...' : '💸 Create Transaction'}
          </button>
        </form>
      </div>

      {/* Pending Transactions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Pending Transactions ({pendingTransactions.length})
          </h3>
          <button
            onClick={fetchPendingTransactions}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {pendingTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-lg">No pending transactions</p>
            <p className="text-sm mt-2">Create a new transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blockchain-blue hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        PENDING
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {transaction.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">From:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                          {transaction.sender}
                        </span>
                      </div>
                      
                      <span className="text-gray-400">→</span>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">To:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono">
                          {transaction.receiver}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blockchain-blue">
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
