import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod'
);

export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}

/**
 * Hashes a plaintext password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password with stored hash
 */
export async function comparePasswords(
  plainText: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Creates an HTTP-ready JWT Token
 */
export async function createJwtToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyJwtToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}