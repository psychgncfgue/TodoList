import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import connection from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

connection.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Database connection error:', error);
});