const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local not found in the project root!');
  process.exit(1);
}

console.log('Reading local .env.local file...');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const env = {};

for (let line of lines) {
  line = line.trim();
  if (!line || line.startsWith('#')) continue;
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    // Remove enclosing quotes if any
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
}

// Special override: For production, we want NEXTAUTH_URL to be the main domain
// If they have dalailulkhairath.com or a vercel domain, let's set it.
env.NEXTAUTH_URL = 'https://dalailulkhairath.com';

// We don't want local upload path in production since Vercel runs serverless (uses Cloudinary)
delete env.UPLOAD_DIRECTORY;

const keysToSync = [
  'CLOUDINARY_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'AES_ENCRYPTION_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'ADMIN_ALLOWED_IPS'
];

console.log('\n--- Syncing Environment Variables to Vercel (Production) ---');

for (const key of keysToSync) {
  const value = env[key] !== undefined ? env[key] : '';
  console.log(`Syncing ${key}...`);

  // 1. Remove existing environment variable if it exists to prevent conflict
  spawnSync('npx', ['vercel', 'env', 'rm', key, 'production', '-y'], {
    encoding: 'utf8',
    stdio: 'ignore',
    shell: true
  });

  // 2. Add the variable to production using stdin to handle special characters safely
  const result = spawnSync('npx', ['vercel', 'env', 'add', key, 'production'], {
    input: value,
    encoding: 'utf8',
    shell: true
  });

  if (result.status === 0) {
    console.log(`✅ Successfully synced ${key}`);
  } else {
    console.error(`❌ Failed to sync ${key}`);
    console.error(result.stderr || result.stdout);
  }
}

console.log('\n🎉 Sync complete! All production environment variables have been updated.');
console.log('💡 Note: You need to trigger a Redeploy on Vercel for these variables to take effect on your live site.');
