import { compare, hash as _hash } from 'bcrypt';

export function hash(raw: string): Promise<string> {
  return _hash(raw, 10);
}

export function compareHashed(raw: string, hashed: string): Promise<boolean> {
  return compare(raw, hashed);
}
