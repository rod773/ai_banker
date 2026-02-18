import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportPage.css';

export default function ReportPage() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [chain, setChain] = useState('bitcoin');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch('http://localhost:8000/report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ walletAddress, chain }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();

      if (data.data?.message) {
        setReport(data.data.message);
      } else {
        setError('Error fetching report');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <header className="report-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>Wallet Report</h1>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          required
        />
        <select value={chain} onChange={e => setChain(e.target.value)}>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {report && (
        <div className="report-container">
          <div className="report-grid">
            <div className="report-card">
              <h3>Actions</h3>
              <div className="report-content">
                <p><strong>Coin:</strong> {report.actions.coin}</p>
                <p><strong>Method:</strong> {report.actions.calculationMethod}</p>
                <p><strong>Total:</strong> {report.actions.totalActions}</p>
                <p><strong>Volume:</strong> {report.actions.tradingVolume}</p>
                <p><strong>Commission:</strong> {report.actions.totalCommissionPaid}</p>
              </div>
            </div>
            <div className="report-card">
              <h3>Profit & Loss</h3>
              <div className="report-content">
                <p><strong>Gain:</strong> {report.profitAndLoss.Gain}</p>
                <p><strong>Loss:</strong> {report.profitAndLoss.Loss}</p>
                <p><strong>Fees:</strong> {report.profitAndLoss.Fees}</p>
                <p><strong>Sum:</strong> {report.profitAndLoss.Sum}</p>
              </div>
            </div>
          </div>
          <div className="insights">
            <h3>Insights</h3>
            <div className="insights-content">
              <p>{report.insights}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
