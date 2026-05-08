const { consumeJobs, connectRabbit } = require('./rabbitmq');
const { updateJob, getJob } = require('./storage');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleJob(message) {
  const job = await getJob(message.id);
  if (!job) {
    console.warn('[worker] job not found:', message.id);
    return;
  }

  console.log('[worker] processing:', job.id, job.title);

  await updateJob(job.id, { status: 'processing', error: null });

  await sleep(2000 + Math.floor(Math.random() * 2000));

  const completed = await updateJob(job.id, {
    status: 'completed',
    result: `Processed "${job.title}" successfully`,
  });

  console.log('[worker] completed:', completed.id);
}

async function bootstrap() {
  try {
    await connectRabbit();
    console.log('[worker] waiting for jobs...');
    await consumeJobs(handleJob);
  } catch (err) {
    console.error('Worker failed to start:', err);
    process.exit(1);
  }
}

bootstrap();
