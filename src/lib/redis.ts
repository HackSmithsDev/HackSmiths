import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw-new Error("❌ REDIS_URL is not defined in environment variables");
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 Cloud Redis Connected & Operational (Upstash)");
  }
});

redis.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err.message);
});

// --- OTP PARAMETER LOGIC (Mirrors your Python FastAPI Engine) ---

/**
 * Stores the OTP verification code mapped to the user email with an explicit expiration window.
 * @param email - Target system identifier channel
 * @param code - 6-8 digit generated alphanumeric/numeric token string
 * @param expiresAt - Time at which the OTP expires
 */
export async function setOtp(email: string, code: string, expiresAt: Date): Promise<void> {
  await redis.set(`otp:${email}`, code, "EX", Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
}

/**
 * Retrieves the live verification code string currently allocated to the target email.
 */
export async function getOtp(email: string): Promise<string | null> {
  return await redis.get(`otp:${email}`);
}

/**
 * Evict the token from memory immediately upon successful validation.
 */
export async function deleteOtp(email: string): Promise<number> {
  return await redis.del(`otp:${email}`);
}