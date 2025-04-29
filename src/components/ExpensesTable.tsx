import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/ExpensesTable.css'

export type Expense = {
  id: number;
  businessName: string;
  invoiceNumber: string;
  businessId: string;
  documentType: string;
  invoiceDate: string;
  totalBeforeVat: number;
  totalWithVat: number;
  category: string;
};

export default function ExpensesTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minTotal, setMinTotal] = useState<number | undefined>();
  const [maxTotal, setMaxTotal] = useState<number | undefined>();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState<Partial<Expense>>({});

  const fetchExpenses = useCallback(() => {
    const params: any = {};
    if (searchTerm) params.name = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (minTotal !== undefined && !isNaN(minTotal)) params.min = minTotal;
    if (maxTotal !== undefined && !isNaN(maxTotal)) params.max = maxTotal;
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;

    setLoading(true);
    axios.get('https://localhost:7129/api/expenses', {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setExpenses(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("❌ שגיאה:", err);
      setLoading(false);
    });
  }, [searchTerm, selectedCategory, minTotal, maxTotal, dateFrom, dateTo]);

  const deleteExpense = (id: number) => {
    if (!window.confirm('האם למחוק את ההוצאה?')) return;
    axios.delete(`https://localhost:7129/api/expenses/${id}`)
      .then(() => fetchExpenses())
      .catch(err => console.error('❌ שגיאת מחיקה:', err));
  };

  const startEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setEditedExpense({ ...exp });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedExpense({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    axios.put(`https://localhost:7129/api/expenses/${editingId}`, editedExpense)
      .then(() => {
        fetchExpenses();
        cancelEdit();
      })
      .catch(err => console.error('❌ שגיאת עדכון:', err));
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExpenses();
    }, 500);
    return () => clearTimeout(debounce);
  }, [fetchExpenses]);

  return (
    <div className="expenses-table">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#00bfff]">רשימת הוצאות</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="חיפוש לפי שם עסק..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">כל הקטגוריות</option>
          <option value="מזון">מזון</option>
          <option value="רכב">רכב</option>
          <option value="IT">IT</option>
          <option value="תפעול">תפעול</option>
          <option value="הדרכה">הדרכה</option>
          <option value="אחר">אחר</option>
        </select>
        <input type="number" placeholder="סכום מינימלי" onChange={(e) => setMinTotal(Number(e.target.value))} />
        <input type="number" placeholder="סכום מקסימלי" onChange={(e) => setMaxTotal(Number(e.target.value))} />
        <input type="date" onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" onChange={(e) => setDateTo(e.target.value)} />
      </div>

      {loading ? (
        <p className="text-center text-white">⏳ טוען נתונים...</p>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>עסק</th>
                <th>תאריך</th>
                <th>לפני מע"מ</th>
                <th>סה"כ</th>
                <th>קטגוריה</th>
                <th>מס'</th>
                <th>🛠️</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>
                    {editingId === e.id ? (
                      <input value={editedExpense.businessName || ''} onChange={(ev) => setEditedExpense({ ...editedExpense, businessName: ev.target.value })} />
                    ) : e.businessName}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <input type="date" value={editedExpense.invoiceDate || ''} onChange={(ev) => setEditedExpense({ ...editedExpense, invoiceDate: ev.target.value })} />
                    ) : new Date(e.invoiceDate).toLocaleDateString('he-IL')}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <input type="number" value={editedExpense.totalBeforeVat ?? ''} onChange={(ev) => setEditedExpense({ ...editedExpense, totalBeforeVat: Number(ev.target.value) })} />
                    ) : e.totalBeforeVat?.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <input type="number" value={editedExpense.totalWithVat ?? ''} onChange={(ev) => setEditedExpense({ ...editedExpense, totalWithVat: Number(ev.target.value) })} />
                    ) : e.totalWithVat?.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <input value={editedExpense.category || ''} onChange={(ev) => setEditedExpense({ ...editedExpense, category: ev.target.value })} />
                    ) : e.category}
                  </td>
                  <td>{e.invoiceNumber}</td>
                  <td>
                    {editingId === e.id ? (
                      <>
                        <button onClick={saveEdit}>💾</button>
                        <button onClick={cancelEdit} className="ml-2">✖️</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(e)}>✏️</button>
                        <button onClick={() => deleteExpense(e.id)} className="ml-2">🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
