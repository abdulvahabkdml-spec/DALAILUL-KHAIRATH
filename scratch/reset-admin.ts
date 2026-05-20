import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: { type: String, required: true },
  isMfaEnabled: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const username = 'admin';
  const PASSWORD = 'Change_This_Strong_Password_123!';
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const user = await User.findOne({ username });

  if (!user) {
    console.log(`❌ User '${username}' not found. Seeding new user...`);
    await User.create({
      username,
      email: 'admin@dalailulkhairath.com',
      passwordHash,
      isMfaEnabled: false,
    });
    console.log(`✅ User '${username}' created with password: ${PASSWORD}`);
  } else {
    user.passwordHash = passwordHash;
    user.isMfaEnabled = false;
    await user.save();
    console.log(`✅ User '${username}' password reset to: ${PASSWORD} and MFA disabled.`);
  }

  await mongoose.disconnect();
}

resetAdmin().catch((err) => {
  console.error('❌ Failed to reset admin:', err);
  process.exit(1);
});
