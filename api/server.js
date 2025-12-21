const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables
dotenv.config();

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SocketFlow Server running on port ${PORT}`);
});
