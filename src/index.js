import express from 'express';
import taskRoutes from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Manager API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/tasks`);
});