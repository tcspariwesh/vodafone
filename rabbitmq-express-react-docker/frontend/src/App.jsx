import React, { useEffect, useMemo, useState } from 'react';

const statusClass = {
  pending: 'badge badge-pending',
  processing: 'badge badge-processing',
  completed: 'badge badge-completed',
  failed: 'badge badge-failed',
};

function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('Generate invoice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sortedJobs = useMemo(() => jobs, [jobs]);

  async function fetchJobs() {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Could not load jobs');
    }
  }

  useEffect(() => {
    fetchJobs();
    const timer = setInterval(fetchJobs, 2000);
    return () => clearInterval(timer);
  }, []);

  async function createJob(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setTitle('');
      await fetchJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetJob(id) {
    try {
      await fetch(`/api/jobs/${id}/reset`, { method: 'POST' });
      await fetchJobs();
    } catch (err) {
      setError('Could not reset job');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">RabbitMQ + Express + React</p>
          <h1>Async job queue demo</h1>
          <p className="subtitle">
            Create a job in the UI, publish it to RabbitMQ, and watch the worker complete it.
          </p>
        </div>
        <button className="secondary" onClick={fetchJobs}>Refresh</button>
      </header>

      <section className="card">
        <form className="form" onSubmit={createJob}>
          <label>
            Job title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Send welcome email"
            />
          </label>
          <button disabled={loading || !title.trim()}>
            {loading ? 'Creating...' : 'Create job'}
          </button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="grid">
        {sortedJobs.length === 0 ? (
          <div className="card empty">
            <h2>No jobs yet</h2>
            <p>Create one to see RabbitMQ processing in action.</p>
          </div>
        ) : (
          sortedJobs.map((job) => (
            <article className="card job" key={job.id}>
              <div className="job-head">
                <div>
                  <h2>{job.title}</h2>
                  <p className="muted">{job.id}</p>
                </div>
                <span className={statusClass[job.status] || 'badge'}>{job.status}</span>
              </div>

              <div className="meta">
                <div><span>Created</span><strong>{formatTime(job.createdAt)}</strong></div>
                <div><span>Updated</span><strong>{formatTime(job.updatedAt)}</strong></div>
              </div>

              {job.result ? (
                <p className="result">{job.result}</p>
              ) : null}

              {job.error ? (
                <p className="error">{job.error}</p>
              ) : null}

              <div className="actions">
                <button className="secondary" onClick={() => resetJob(job.id)}>
                  Requeue
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
