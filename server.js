const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
