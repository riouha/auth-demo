import { randomBytes } from 'crypto';

export function generateRandomCode() {
  const random = randomBytes(4).readUInt32BE() % 99999;
  return String(random).padStart(5, '0');
}
