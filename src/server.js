const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { port } = require('./config/config');
const app = require('./app');

dotenv.config({ path: './config.env' });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on(
  'error',
  console.error.bind(console, 'Connection Error'),
);

mongoose.connection.on('open', () => {
  console.log('Mongodb Connected');
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
