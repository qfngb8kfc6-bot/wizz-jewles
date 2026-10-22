// Usage: npm run admin:hash -- "your password"
import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run admin:hash -- "a password of 10+ characters"');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32);
console.log(`ADMIN_PASSWORD_HASH="scrypt:${salt.toString("hex")}:${hash.toString("hex")}"`);
