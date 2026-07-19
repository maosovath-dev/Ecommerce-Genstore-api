const express = require('express');

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const productRoutes = require('./routes/product.route');
const categoryRoutes = require('./routes/category.route');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})