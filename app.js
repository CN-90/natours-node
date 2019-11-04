const express = require('exrpess');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.write('Hello idiot...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${port}`);
});
