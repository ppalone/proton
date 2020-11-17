const mongoose = require('mongoose');

(async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to Mongodb');
  } catch (err) {
    console.log(err);
  }
})();
