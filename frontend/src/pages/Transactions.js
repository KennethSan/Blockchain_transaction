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
    <div className="space-y-10">
      {/* Header */}
      <div className="glass-panel overflow-hidden px-8 py-10">
        <span className="glow-ring" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">transactions</p>
            <h2 className="font-heading text-4xl text-white md:text-5xl">Craft new transfers with neon precision.</h2>
            <p className="text-base text-white/70 md:text-lg">
              Spin up ledger entries, watch pending queues glow, and orchestrate the flow of value with a stage-lit interface.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm text-white/80 backdrop-blur-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">pending</p>
            <p className="mt-2 text-3xl font-heading text-nebula-ice">{pendingTransactions.length}</p>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">awaiting inclusion</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Create Transaction Form */}
        <div className="glass-panel overflow-hidden px-8 py-8">
          <span className="glow-ring" aria-hidden="true" />
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">new transfer</p>
              <h3 className="mt-3 font-heading text-2xl text-white md:text-3xl">Encode a fresh transaction</h3>
              <div className="mt-4 h-0.5 w-24 rounded-full bg-gradient-to-r from-nebula-magenta via-nebula-purple to-nebula-cyan" />
            </div>

            {message && (
              <div
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 text-sm font-medium shadow-glow-sm ${
                  message.type === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                }`}
              >
                <span className="relative z-10 block text-base">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
                  Sender
                </label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 shadow-inner transition focus:border-nebula-magenta focus:outline-none focus:ring-2 focus:ring-nebula-magenta/40"
                  placeholder="Enter sender name or address"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
                  Receiver
                </label>
                <input
                  type="text"
                  name="receiver"
                  value={formData.receiver}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 shadow-inner transition focus:border-nebula-magenta focus:outline-none focus:ring-2 focus:ring-nebula-magenta/40"
                  placeholder="Enter receiver name or address"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
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
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 shadow-inner transition focus:border-nebula-magenta focus:outline-none focus:ring-2 focus:ring-nebula-magenta/40"
                  placeholder="Enter amount"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-nebula-magenta via-nebula-purple to-nebula-cyan px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-glow-sm transition disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
              >
                <span className="relative z-10">{loading ? 'Creating...' : '💸 Create Transaction'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Pending Transactions List */}
        <div className="glass-panel overflow-hidden px-8 py-8">
          <span className="glow-ring" aria-hidden="true" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">queue</p>
                <h3 className="mt-3 font-heading text-2xl text-white md:text-3xl">
                  Pending Transactions ({pendingTransactions.length})
                </h3>
              </div>
              <button
                onClick={fetchPendingTransactions}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                🔄 Refresh
              </button>
            </div>

            {pendingTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-8 py-16 text-center text-white/60">
                <span className="text-5xl">📭</span>
                <p className="mt-4 text-lg font-semibold text-white/70">No pending transactions</p>
                <p className="mt-2 text-sm text-white/50">Submit a new transfer to light up the queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-nebula-magenta/40 hover:shadow-glow-sm"
                  >
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                          <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-yellow-200">pending</span>
                          <span>ID: {transaction.id}</span>
                        </div>

                        <div className="flex flex-col gap-3 text-sm text-white/80 md:flex-row md:items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-white/50">From</span>
                            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-nebula-ice">
                              {transaction.sender}
                            </span>
                          </div>
                          <span className="hidden text-white/40 md:block">⟶</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/50">To</span>
                            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-nebula-ice">
                              {transaction.receiver}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-heading text-nebula-ice">
                          ${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/50">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
