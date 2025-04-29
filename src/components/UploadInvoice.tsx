import { useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import '../styles/UploadInovice.css';
import { API_BASE_URL } from '../utils/fetchWithAuth';


export default function UploadInvoice() {
  // Local state for selected file, OCR result, upload status, and error message
  const [file, setFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  // Upload handler - triggered when the user clicks the upload button
  const handleUpload = async () => {
    if (!file) {
      setError('נא לבחור קובץ');
      return;
    }

    setStatus('loading');
    setError('');
    setOcrData(null);

    const formData = new FormData();
    formData.append('file', file); // Attach file to form data

    try {
      // Authenticated POST request to upload file for OCR
      const res = await fetchWithAuth(`${API_BASE_URL}/api/Upload/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`שגיאה בהעלאת קובץ ל-OCR: ${msg}`);
      }

      // Parse and store response data
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

      {/* File input (image or PDF) */}
      <label className="custom-file-upload">
        בחרי קובץ
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {/* Upload button (disabled while loading) */}
      <button
        onClick={handleUpload}
        disabled={status === 'loading'}
        className="upload-button"
      >
        {status === 'loading' ? 'מעלה וסורק...' : 'העלה וסרוק'}
      </button>

      {/* Display error message if any */}
      {error && <div className="upload-error">{error}</div>}

      {/* Show success message when done */}
      {status === 'done' && (
        <div className="upload-success">✔️ החשבונית נשמרה בהצלחה</div>
      )}

      {/* Display parsed OCR result */}
      {ocrData && (
        <div className="upload-preview">
          <h3 className="preview-title">חשבונית שנשמרה:</h3>
          <pre>{JSON.stringify(ocrData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
