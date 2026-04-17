import { useState } from 'react';
import api from '../../api';

const EMPTY = { serialNo: '', title: '', author: '', category: '', mediaType: 'book' };

export default function AddBook() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.serialNo.trim()) e.serialNo = 'Serial number is required.';
    if (!form.title.trim())    e.title    = 'Title is required.';
    if (!form.author.trim())   e.author   = 'Author is required.';
    if (!form.category.trim()) e.category = 'Category is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await api.post('/books', form);
      setMsg(`✅ "${form.title}" added successfully!`);
      setForm(EMPTY);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to add book.' });
    } finally { setLoading(false); }
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      <div className="page-title">➕ Add Book / Movie</div>
      <div className="page-subtitle">Add a new book or movie to the library catalogue.</div>

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
              <label htmlFor="serialNo">Serial Number *</label>
              <input id="serialNo" className={`form-control${errors.serialNo ? ' error' : ''}`}
                placeholder="e.g. B001" value={form.serialNo}
                onChange={e => set('serialNo', e.target.value)} />
              {errors.serialNo && <span className="field-error">{errors.serialNo}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input id="category" className={`form-control${errors.category ? ' error' : ''}`}
                placeholder="e.g. Fiction, Science" value={form.category}
                onChange={e => set('category', e.target.value)} />
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input id="title" className={`form-control${errors.title ? ' error' : ''}`}
              placeholder="Enter title" value={form.title}
              onChange={e => set('title', e.target.value)} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Author / Director *</label>
            <input id="author" className={`form-control${errors.author ? ' error' : ''}`}
              placeholder="Enter author or director name" value={form.author}
              onChange={e => set('author', e.target.value)} />
            {errors.author && <span className="field-error">{errors.author}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding…' : '➕ Add to Library'}
          </button>
        </form>
      </div>
    </div>
  );
}
