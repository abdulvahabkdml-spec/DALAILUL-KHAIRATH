
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  isMfaEnabled: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function disableMfa() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const username = 'admin';
  const user = await User.findOne({ username });

  if (!user) {
    console.log(`❌ User '${username}' not found.`);
    await mongoose.disconnect();
    return;
  }

  user.isMfaEnabled = false;
  await user.save();

  console.log(`✅ MFA has been disabled for user '${username}'.`);
  await mongoose.disconnect();
}

disableMfa().catch((err) => {
  console.error('❌ Failed to disable MFA:', err);
  process.exit(1);
});
