import { useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import '../styles/UploadInovice.css';


export default function UploadInvoice() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('נא לבחור קובץ');
      return;
    }

    setStatus('loading');
    setError('');
    setOcrData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetchWithAuth('https://localhost:7129/api/Upload/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`שגיאה בהעלאת קובץ ל-OCR: ${msg}`);
      }

      const data = await res.json();
      setOcrData(data);
      setStatus('done');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה כללית');
      setStatus('error');
    }
  };

  return (
    <div className="upload-card">
      <h2 className="upload-title">העלאת חשבונית לסריקה</h2>

      <label className="custom-file-upload">
  בחרי קובץ
  <input
    type="file"
    accept="image/*,application/pdf"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
  />
</label>

      <button
        onClick={handleUpload}
        disabled={status === 'loading'}
        className="upload-button"
      >
        {status === 'loading' ? 'מעלה וסורק...' : 'העלה וסרוק'}
      </button>

      {error && <div className="upload-error">{error}</div>}

      {status === 'done' && (
        <div className="upload-success">✔️ החשבונית נשמרה בהצלחה</div>
      )}

      {ocrData && (
        <div className="upload-preview">
          <h3 className="preview-title">חשבונית שנשמרה:</h3>
          <pre>{JSON.stringify(ocrData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
