const fs = require('fs/promises');
const path = require('path');
const { dataDir } = require('./config');

const dbFile = path.join(dataDir, 'jobs.json');

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbFile);
  } catch {
    await fs.writeFile(dbFile, JSON.stringify({ jobs: [] }, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbFile, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await ensureDb();
  const tempFile = `${dbFile}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(db, null, 2));
  await fs.rename(tempFile, dbFile);
}

function sortJobs(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

async function listJobs() {
  const db = await readDb();
  return db.jobs.sort(sortJobs);
}

async function getJob(id) {
  const db = await readDb();
  return db.jobs.find((job) => job.id === id) || null;
}

async function addJob(job) {
  const db = await readDb();
  db.jobs.push(job);
  await writeDb(db);
  return job;
}

async function updateJob(id, patch) {
  const db = await readDb();
  const index = db.jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  db.jobs[index] = {
    ...db.jobs[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);
  return db.jobs[index];
}

module.exports = {
  listJobs,
  getJob,
  addJob,
  updateJob,
};
