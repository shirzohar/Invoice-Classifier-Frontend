import { useState } from 'react';
import UploadInvoice from '../components/UploadInvoice';
import ExpensesTable from '../components/ExpensesTable';
import DashboardCharts from './DashboardCharts'; //  charts view
import '../styles/Dashboard.css';

export default function Dashboard() {
  // State to manage which tab is currently active
  const [tab, setTab] = useState<'upload' | 'expenses' | 'charts'>('upload');

  return (
    <div className="dashboard-banner">
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">ברוכה הבאה למערכת ניהול הוצאות</h1>

        {/* Navigation buttons to switch between views */}
        <div className="dashboard-tabs">
          <button
            onClick={() => setTab('upload')}
            className={`dashboard-tab ${tab === 'upload' ? 'active' : ''}`}
          >
            העלאת חשבוניות
          </button>
          <button
            onClick={() => setTab('expenses')}
            className={`dashboard-tab ${tab === 'expenses' ? 'active' : ''}`}
          >
            ניהול הוצאות
          </button>
          <button
            onClick={() => setTab('charts')}
            className={`dashboard-tab ${tab === 'charts' ? 'active' : ''}`}
          >
            גרפים וסטטיסטיקות
          </button>
        </div>

        {/* Conditional rendering of components based on selected tab */}
        <div className="dashboard-content">
          {tab === 'upload' && <UploadInvoice />}
          {tab === 'expenses' && <ExpensesTable />}
          {tab === 'charts' && <DashboardCharts />}
        </div>
      </div>
    </div>
  );
}
