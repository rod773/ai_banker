require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 8000;


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const authRoutes = require('./routes/authenticationRoute');
const report = require('./routes/reportRoute');
const user = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/report', report);
app.use('/user', user);

app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});