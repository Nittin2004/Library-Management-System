import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function BookAvailable() {
  const [titleInput, setTitleInput]     = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories]     = useState([]);
  const [results, setResults]           = useState([]);
  const [selectedSerial, setSelectedSerial] = useState('');
  const [searched, setSearched]         = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/books/categories/list').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!titleInput.trim() && !categoryInput) {
      setError('Please enter a title or select a category before searching.');
      return;
    }
    setError(''); setLoading(true); setSelectedSerial('');
    try {
      const params = new URLSearchParams({ available: 'true' });
      if (titleInput.trim()) params.append('title', titleInput.trim());
      if (categoryInput)     params.append('category', categoryInput);
      const res = await api.get(`/books?${params}`);
      setResults(res.data);
      setSearched(true);
    } catch {
      setError('Failed to fetch books. Please try again.');
    } finally { setLoading(false); }
  };

  const handleIssue = () => {
    if (!selectedSerial) { setError('Please select a book using the radio button.'); return; }
    const book = results.find(b => b.serialNo === selectedSerial);
    navigate('/transactions/book-issue', { state: { book } });
  };

  return (
    <div>
      <div className="page-title">🔍 Book Available</div>
      <div className="page-subtitle">Search for available books by title or category.</div>

      <div className="card">
        {error && <div className="form-error-box">{error}</div>}

        <form onSubmit={handleSearch} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="titleSearch">Search by Title</label>
              <input id="titleSearch" className="form-control"
                placeholder="Enter book title…" value={titleInput}
                onChange={e => setTitleInput(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="catSearch">Filter by Category</label>
              <select id="catSearch" className="form-control"
                value={categoryInput} onChange={e => setCategoryInput(e.target.value)}>
                <option value="">— All Categories —</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching…' : '🔍 Search'}
          </button>
        </form>
      </div>

      {searched && (
        <div className="card">
          {results.length === 0 ? (
            <div className="empty-state">No available books found matching your criteria.</div>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Serial No</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(book => (
                      <tr key={book.serialNo} style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedSerial(book.serialNo)}>
                        <td>
                          <input type="radio" name="bookSelect"
                            checked={selectedSerial === book.serialNo}
                            onChange={() => setSelectedSerial(book.serialNo)} />
                        </td>
                        <td>{book.serialNo}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>
                          <span className={`badge ${book.mediaType === 'book' ? 'badge-blue' : 'badge-yellow'}`}>
                            {book.mediaType === 'book' ? '📚 Book' : '🎬 Movie'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={handleIssue}>
                  📤 Proceed to Issue Selected Book
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
