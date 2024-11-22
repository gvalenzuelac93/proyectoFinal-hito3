require('dotenv').config();
const app = require('./src/app');
console.log(process.env.JWT_SECRET);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});