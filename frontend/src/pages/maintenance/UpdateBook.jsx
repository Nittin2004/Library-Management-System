import { useState } from 'react';
import api from '../../api';

export default function UpdateBook() {
  const [serialNo, setSerialNo] = useState('');
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [looking, setLooking] = useState(false);

  const lookup = async () => {
    if (!serialNo.trim()) { setErrors({ search: 'Serial number is required.' }); return; }
    setErrors({}); setMsg(''); setLooking(true);
    try {
      const res = await api.get(`/books/${serialNo.trim()}`);
      setForm(res.data);
    } catch {
      setErrors({ search: 'Book not found with this serial number.' });
      setForm(null);
    } finally { setLooking(false); }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Title is required.';
    if (!form.author.trim())   e.author   = 'Author is required.';
    if (!form.category.trim()) e.category = 'Category is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await api.put(`/books/${form.serialNo}`, form);
      setMsg(`✅ "${form.title}" updated successfully!`);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Update failed.' });
    } finally { setLoading(false); }
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      <div className="page-title">✏️ Update Book / Movie</div>
      <div className="page-subtitle">Look up a book by serial number to update its details.</div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="searchSerial">Serial Number</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id="searchSerial" className={`form-control${errors.search ? ' error' : ''}`}
              placeholder="Enter serial number" value={serialNo}
              onChange={e => setSerialNo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()} />
            <button type="button" className="btn btn-secondary" onClick={lookup} disabled={looking}>
              {looking ? 'Searching…' : '🔍 Search'}
            </button>
          </div>
          {errors.search && <span className="field-error">{errors.search}</span>}
        </div>
      </div>

      {form && (
        <div className="card">
          {msg && <div className="form-success-box">{msg}</div>}
          {errors.general && <div className="form-error-box">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Media Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="mediaType" value="book"
                    checked={form.mediaType === 'book'} onChange={() => set('mediaType', 'book')} />
                  📚 Book
                </label>
                <label className="radio-label">
                  <input type="radio" name="mediaType" value="movie"
                    checked={form.mediaType === 'movie'} onChange={() => set('mediaType', 'movie')} />
                  🎬 Movie
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Serial Number</label>
                <input className="form-control" value={form.serialNo} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="uCategory">Category *</label>
                <input id="uCategory" className={`form-control${errors.category ? ' error' : ''}`}
                  value={form.category} onChange={e => set('category', e.target.value)} />
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="uTitle">Title *</label>
              <input id="uTitle" className={`form-control${errors.title ? ' error' : ''}`}
                value={form.title} onChange={e => set('title', e.target.value)} />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="uAuthor">Author / Director *</label>
              <input id="uAuthor" className={`form-control${errors.author ? ' error' : ''}`}
                value={form.author} onChange={e => set('author', e.target.value)} />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label>Available</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" checked={form.available === true} onChange={() => set('available', true)} /> Yes
                </label>
                <label className="radio-label">
                  <input type="radio" checked={form.available === false} onChange={() => set('available', false)} /> No
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
