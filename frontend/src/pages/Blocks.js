import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../services/api';

function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await blockchainAPI.getBlocks();
      if (response.data.success) {
        setBlocks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Blockchain</h2>
            <p className="text-gray-600">View all mined blocks in the chain</p>
          </div>
          <button
            onClick={fetchBlocks}
            disabled={loading}
            className="px-4 py-2 bg-blockchain-blue text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 font-medium"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Blocks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-800 opacity-80">Total Blocks</p>
          <p className="text-3xl font-bold text-blue-800 mt-2">{blocks.length}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-800 opacity-80">Total Transactions</p>
          <p className="text-3xl font-bold text-green-800 mt-2">
            {blocks.reduce((sum, block) => sum + (block.transactions?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <p className="text-sm font-medium text-purple-800 opacity-80">Longest Chain</p>
          <p className="text-3xl font-bold text-purple-800 mt-2">
            {blocks.length > 0 ? blocks[blocks.length - 1].index_no + 1 : 0}
          </p>
        </div>
      </div>

      {/* Blockchain Visualization */}
      {blocks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-6xl mb-4">⛓️</p>
          <p className="text-xl text-gray-600 font-semibold">No blocks in the chain yet</p>
          <p className="text-gray-500 mt-2">Mine your first block to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {/* Block Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blockchain-blue hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blockchain-blue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      #{block.index_no}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Block #{block.index_no}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(block.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ✅ MINED
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Nonce: {block.nonce}
                    </p>
                  </div>
                </div>

                {/* Hash Information */}
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Current Hash</p>
                    <p className="font-mono text-sm text-green-700 break-all">
                      {block.current_hash}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Previous Hash</p>
                    <p className="font-mono text-sm text-blue-700 break-all">
                      {block.previous_hash === '0' ? (
                        <span className="text-gray-500 italic">Genesis Block (No Previous Hash)</span>
                      ) : (
                        block.previous_hash
                      )}
                    </p>
                  </div>
                </div>

                {/* Transactions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">
                      Transactions ({block.transactions?.length || 0})
                    </h4>
                  </div>
                  
                  {block.transactions && block.transactions.length > 0 ? (
                    <div className="space-y-2">
                      {block.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs">
                                {tx.sender}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs">
                                {tx.receiver}
                              </span>
                            </div>
                            <span className="font-bold text-blockchain-blue">
                              ${parseFloat(tx.amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No transactions in this block</p>
                  )}
                </div>
              </div>

              {/* Chain Link Arrow */}
              {index < blocks.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="w-1 h-6 bg-blockchain-blue"></div>
                    <div className="text-blockchain-blue text-2xl">⬇</div>
                    <div className="w-1 h-6 bg-blockchain-blue"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blocks;
