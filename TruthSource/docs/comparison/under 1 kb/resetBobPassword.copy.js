const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust the path as needed

mongoose.connect('mongodb://admin:admin123@127.0.0.1:27017/car-haul?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    const hash = await bcrypt.hash('asdf123', 10);
    const res = await User.updateOne(
      { email: 'bob@example.com' },
      { $set: { password: hash } }
    );
    console.log('✅ Password reset result:', res);
    process.exit();
  } catch (err) {
    console.error('❌ Error resetting password:', err);
    process.exit(1);
  }
})();
