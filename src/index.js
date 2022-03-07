require('dotenv').config();

const cors = require('cors');
const express = require('express');
const router = require('./routes/route');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(process.env.PORT || 5000);
