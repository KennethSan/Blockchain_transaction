import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../services/api';

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

  const buttonBase =
    'group relative overflow-hidden rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="glass-panel overflow-hidden px-8 py-10">
        <span className="glow-ring" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">command center</p>
            <h2 className="font-heading text-4xl text-white md:text-5xl">
              Monitor, mine, and validate the chain in real time.
            </h2>
            <p className="text-base text-white/70 md:text-lg">
              Stay in control of your ledger with live stats, interactive actions, and a glowing activity stream inspired by cosmic synthwave aesthetics.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white/80 backdrop-blur-xl">
            <span className="text-4xl animate-float">⚡</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">status</p>
              <p className="text-lg font-heading text-nebula-ice">
                {statistics ? (statistics.is_valid ? 'Chain Stable' : 'Chain Alert') : 'Synchronizing...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
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
            color="amber"
            icon="⏳"
          />
          <StatCard
            title="Blockchain Status"
            value={statistics.is_valid ? 'Valid' : 'Invalid'}
            color={statistics.is_valid ? 'emerald' : 'rose'}
            icon={statistics.is_valid ? '✅' : '⚠️'}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="glass-panel overflow-hidden px-8 py-8">
        <span className="glow-ring" aria-hidden="true" />
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">actions</p>
            <h3 className="mt-3 font-heading text-2xl text-white md:text-3xl">Direct the flow of blocks and validate integrity.</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleMineBlock}
              disabled={loading}
              className={`${buttonBase} bg-gradient-to-r from-nebula-magenta via-nebula-purple to-nebula-cyan text-white shadow-glow-sm`}
            >
              <span className="relative z-10">{loading ? '⛏️ Mining...' : '⛏️ Mine Block'}</span>
            </button>

            <button
              onClick={handleValidateChain}
              disabled={loading}
              className={`${buttonBase} bg-gradient-to-r from-nebula-cyan via-nebula-purple to-nebula-magenta text-white/90 shadow-glow-sm`}
            >
              <span className="relative z-10">{loading ? '🔄 Validating...' : '🔍 Validate Chain'}</span>
            </button>

            <button
              onClick={fetchStatistics}
              className={`${buttonBase} border border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white`}
            >
              <span className="relative z-10">🔄 Refresh Stats</span>
            </button>
          </div>

          {validationStatus !== null && (
            <div
              className={`relative overflow-hidden rounded-2xl border px-6 py-5 shadow-glow-sm ${
                validationStatus
                  ? 'border-emerald-400/40 bg-emerald-500/10'
                  : 'border-rose-500/40 bg-rose-500/10'
              }`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="text-3xl">
                  {validationStatus ? '✨' : '⚠️'}
                </span>
                <p className="text-base font-semibold text-white md:text-lg">
                  {validationStatus
                    ? 'Blockchain is VALID — every block sparkles with integrity.'
                    : 'Blockchain is INVALID — investigate tampering or mismatched hashes.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mining Log */}
      {miningLog.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <span className="glow-ring" aria-hidden="true" />
          <div className="relative z-10 px-8 py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">live feed</p>
                <h3 className="mt-3 font-heading text-2xl text-white md:text-3xl">Activity Log</h3>
              </div>
              <button
                onClick={clearLogs}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Clear Logs
              </button>
            </div>

            <div className="max-h-[22rem] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 px-6 py-5 font-mono text-sm text-white/80">
              {miningLog.map((log, index) => (
                <div key={index} className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                  <span className="text-xs uppercase tracking-[0.35em] text-white/50">{log.timestamp}</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'font-semibold text-emerald-300'
                        : log.type === 'error'
                        ? 'font-semibold text-rose-300'
                        : 'text-white/70'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const themes = {
    blue: {
      gradient: 'from-[#4338ca]/70 via-[#312e81]/40 to-transparent',
      accent: 'bg-[#4338ca]/40 text-[#c7d2fe]',
    },
    purple: {
      gradient: 'from-[#6d28d9]/70 via-[#4c1d95]/40 to-transparent',
      accent: 'bg-[#6d28d9]/35 text-[#ede9fe]',
    },
    amber: {
      gradient: 'from-[#f59e0b]/50 via-[#b45309]/30 to-transparent',
      accent: 'bg-[#f59e0b]/35 text-[#fef3c7]',
    },
    emerald: {
      gradient: 'from-[#10b981]/60 via-[#047857]/35 to-transparent',
      accent: 'bg-[#10b981]/35 text-[#d1fae5]',
    },
    rose: {
      gradient: 'from-[#f43f5e]/60 via-[#be123c]/35 to-transparent',
      accent: 'bg-[#f43f5e]/35 text-[#ffe4e6]',
    },
  };

  const theme = themes[color] || themes.blue;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-md">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">{title}</p>
          <p className="mt-4 font-heading text-4xl text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${theme.accent} shadow-glow-sm`}>
          <span className="animate-float">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
