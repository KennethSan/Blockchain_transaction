import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Blocks from './pages/Blocks';

function App() {
  const navigation = [
    { path: '/', label: 'Dashboard', icon: '⌁' },
    { path: '/transactions', label: 'Transactions', icon: '◎' },
    { path: '/blocks', label: 'Blocks', icon: '✦' },
  ];

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-nebula-bg via-nebula-deep to-black text-slate-100">
        {/* Ambient backdrops */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute -top-40 -right-32 h-96 w-96 animate-pulse-glow rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 65%)',
            }}
          />
          <div
            className="absolute -bottom-48 -left-24 h-[28rem] w-[28rem] animate-float rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 60%)',
            }}
          />
          <div className="absolute inset-0 opacity-[0.15]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />
          </div>
        </div>

        <div className="relative z-10">
          {/* Navigation */}
          <header className="px-6 pt-8 md:px-12">
            <div className="glass-panel mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-5 md:px-10">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-nebula-magenta via-nebula-purple to-nebula-cyan text-2xl shadow-glow-md">
                  <span className="font-heading text-3xl drop-shadow-glow">⭑</span>
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-semibold tracking-wide text-white md:text-4xl">
                    Nebula Chain
                  </h1>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/60 md:text-xs">
                    cosmic blockchain interface
                  </p>
                </div>
              </div>

              <nav className="flex flex-1 items-center justify-end gap-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-500 md:px-5 ${
                        isActive
                          ? 'bg-gradient-to-r from-nebula-magenta via-nebula-purple to-nebula-cyan text-white shadow-glow-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative mx-auto mt-12 w-full max-w-6xl px-6 pb-24 md:px-12">
            <div className="absolute inset-x-0 top-0 -z-10 h-64 rounded-full bg-gradient-to-r from-nebula-magenta/20 via-nebula-purple/35 to-nebula-cyan/20 blur-3xl" />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/blocks" element={<Blocks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
