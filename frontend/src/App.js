import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Blocks from './pages/Blocks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blockchain-blue">
                  ⛓️ Blockchain App
                </h1>
              </div>
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/transactions" 
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Transactions
                </Link>
                <Link 
                  to="/blocks" 
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Blocks
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/blocks" element={<Blocks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
