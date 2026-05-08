const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const { port } = require('./config');
const { addJob, listJobs, getJob, updateJob } = require('./storage');
const { publishJob, connectRabbit } = require('./rabbitmq');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api', timestamp: new Date().toISOString() });
});

app.get('/api/jobs', async (_req, res) => {
  try {
    const jobs = await listJobs();
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load job' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const title = String(req.body?.title || '').trim();
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const now = new Date().toISOString();
    const job = {
      id: randomUUID(),
      title,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      result: null,
      error: null,
    };

    await addJob(job);
    await publishJob({ id: job.id, title: job.title });

    res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.post('/api/jobs/:id/reset', async (req, res) => {
  try {
    const job = await getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const updated = await updateJob(req.params.id, {
      status: 'pending',
      result: null,
      error: null,
    });

    await publishJob({ id: updated.id, title: updated.title });
    res.json({ job: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset job' });
  }
});

async function bootstrap() {
  try {
    await connectRabbit();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start API:', err);
    process.exit(1);
  }
}

bootstrap();
