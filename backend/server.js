require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Supabase Client
const supabase = require('./src/config/supabase');

const app = express();



app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
const whatsappRoutes = require('./src/routes/whatsapp');
const productRoutes = require('./src/routes/products');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const inquiryRoutes = require('./src/routes/inquiry');
const shippingRoutes = require('./src/routes/shipping');
const cartRoutes = require('./src/routes/cart');

app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
