import { useEffect, useRef, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import html2canvas from 'html2canvas';
import '../styles/DashboardCharts.css';
import { API_BASE_URL } from '../utils/fetchWithAuth';


// Expected shape of API summary response
type SummaryResponse = {
  byCategory: { category: string; total: number }[];
  byMonth: { month: number; total: number }[];
};

export default function DashboardCharts() {
  // Local state: data from backend and loading status
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs used for downloading chart images
  const pieRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Fetch chart data on component mount
  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/api/Reports/summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('שגיאה בטעינת הדוחות', err);
        setLoading(false);
      });
  }, []);

  // Predefined color palette for chart segments
  const colors = ['#00bfff', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57'];

  // Download chart as PNG using html2canvas
  const downloadChart = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string
  ) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Show loading or error messages
  if (loading) return <div className="text-center mt-8">🔄 טוען גרפים...</div>;
  if (!summary) return <div className="text-center mt-8 text-red-500">⚠ שגיאה בטעינת נתונים</div>;

  return (
    <div className="charts-wrapper">
      {/* Pie chart: expenses by category */}
      <div className="chart-card" ref={pieRef}>
        <h2 className="chart-title">הוצאות לפי קטגוריה</h2>
        <ResponsiveContainer width={400} height={300}>
          <PieChart>
            <Pie
              data={summary.byCategory}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {summary.byCategory.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <button className="download-btn" onClick={() => downloadChart(pieRef, 'expenses-by-category')}>
          הורד גרף כ־PNG
        </button>
      </div>

      {/* Line chart: expenses by month */}
      <div className="chart-card" ref={lineRef}>
        <h2 className="chart-title">הוצאות לפי חודש</h2>
        <ResponsiveContainer width={500} height={300}>
          <LineChart data={summary.byMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) => {
                if (summary.byMonth.length <= 1) return '';
                return ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצ'][month - 1] || '';
              }}
              tick={{ fill: '#fff', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#00bfff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <button className="download-btn" onClick={() => downloadChart(lineRef, 'expenses-by-month')}>
          הורד גרף כ־PNG
        </button>
      </div>
    </div>
  );
}
