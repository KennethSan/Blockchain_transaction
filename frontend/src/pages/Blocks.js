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
    <div className="space-y-10">
      {/* Header */}
      <div className="glass-panel overflow-hidden px-8 py-10">
        <span className="glow-ring" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">chain explorer</p>
            <h2 className="font-heading text-4xl text-white md:text-5xl">
              Trace the luminous path of every block.
            </h2>
            <p className="text-base text-white/70 md:text-lg">
              Inspect hashes, follow nonce signatures, and watch the timeline shimmer as each block maintains integrity.
            </p>
          </div>
          <button
            onClick={fetchBlocks}
            disabled={loading}
            className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Blocks Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatPanel
          label="Total Blocks"
          value={blocks.length}
          gradient="linear-gradient(135deg, rgba(124,58,237,0.6), rgba(56,189,248,0.35))"
        />
        <StatPanel
          label="Total Transactions"
          value={blocks.reduce((sum, block) => sum + (block.transactions?.length || 0), 0)}
          gradient="linear-gradient(135deg, rgba(236,72,153,0.6), rgba(250,204,21,0.35))"
        />
        <StatPanel
          label="Longest Chain"
          value={blocks.length > 0 ? blocks[blocks.length - 1].index_no + 1 : 0}
          gradient="linear-gradient(135deg, rgba(59,130,246,0.6), rgba(16,185,129,0.35))"
        />
      </div>

      {/* Blockchain Visualization */}
      {blocks.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center gap-4 px-10 py-16 text-center text-white/70">
          <span className="text-6xl">⛓️</span>
          <h3 className="text-2xl font-semibold text-white/80">No blocks in the chain yet</h3>
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">Mine your first block to illuminate the path.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {blocks.map((block, index) => (
            <div key={block.id} className="space-y-10">
              <div className="glass-panel overflow-hidden px-8 py-8 transition duration-700 hover:-translate-y-1">
                <span className="glow-ring" aria-hidden="true" />
                <div className="relative z-10 space-y-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nebula-magenta via-nebula-purple to-nebula-cyan text-2xl font-heading text-white shadow-glow-sm">
                        #{block.index_no}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">block height</p>
                        <h3 className="mt-2 font-heading text-3xl text-white">Block {block.index_no}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/50">
                          {new Date(block.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                        ✅ Mined
                      </span>
                      <span className="text-xs uppercase tracking-[0.35em] text-white/50">Nonce: {block.nonce}</span>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <HashPanel label="Current Hash" value={block.current_hash} tone="emerald" />
                    <HashPanel
                      label="Previous Hash"
                      value={
                        block.previous_hash === '0'
                          ? 'Genesis Block (No Previous Hash)'
                          : block.previous_hash
                      }
                      tone="cyan"
                    />
                  </div>

                  <div className="nebula-divider" />

                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">transactions</p>
                        <h4 className="font-heading text-xl text-white md:text-2xl">
                          Included ({block.transactions?.length || 0})
                        </h4>
                      </div>
                      <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
                        Hash Target ✦ 0000
                      </span>
                    </div>

                    {block.transactions && block.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {block.transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-nebula-magenta/40 hover:shadow-glow-sm"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex flex-col gap-2 text-sm text-white/80 md:flex-row md:items-center md:gap-4">
                                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-nebula-ice">
                                  {tx.sender}
                                </span>
                                <span className="hidden text-white/40 md:block">⟶</span>
                                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-nebula-ice">
                                  {tx.receiver}
                                </span>
                              </div>
                              <span className="text-lg font-heading text-nebula-ice">
                                ${parseFloat(tx.amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-5 py-6 text-sm text-white/60">
                        No transactions in this block.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {index < blocks.length - 1 && (
                <div className="flex justify-center" aria-hidden="true">
                  <div className="h-24 w-px bg-gradient-to-b from-nebula-magenta via-white/20 to-nebula-purple" />
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

function StatPanel({ label, value, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-glow-sm">
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: gradient }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/60">{label}</p>
        <p className="mt-4 font-heading text-4xl text-white">{value}</p>
      </div>
    </div>
  );
}

function HashPanel({ label, value, tone }) {
  const toneClasses = {
    emerald: 'border-emerald-400/40 text-emerald-200',
    cyan: 'border-nebula-cyan/40 text-nebula-ice',
  };

  return (
    <div className={`rounded-2xl border bg-black/30 p-5 font-mono text-xs ${toneClasses[tone] || 'border-white/10 text-white/70'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/40">{label}</p>
      <p className="mt-3 break-words text-[13px] leading-relaxed">
        {value}
      </p>
    </div>
  );
}
