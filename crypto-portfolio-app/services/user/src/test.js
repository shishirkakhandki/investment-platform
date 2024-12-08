// const mongoose = require('mongoose');
// require('dotenv').config({ path: '/home/pearly/Desktop/shipfinex/crypto-portfolio-app/services/user/src/.env' }); // Load environment variables

// const uri = process.env.MONGO_URI;

// if (!uri) {
//   console.error('Error: MONGO_URI is not set in .env file');
//   process.exit(1);
// }

// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB successfully');
//     mongoose.connection.close(); // Close the connection
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });
