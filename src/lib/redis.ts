import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error("❌ REDIS_URL is not defined in environment variables");
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,

  retryStrategy(times) {
    if (times > 3) {
      return null;
    }

    return Math.min(times * 200, 2000);
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


export async function setOtp(
  email: string,
  code: string,
  expiresAt: Date
): Promise<void> {
  const expirySeconds = Math.ceil(
    (expiresAt.getTime() - Date.now()) / 1000
  );

  await redis.set(
    `otp:${email}`,
    code,
    "EX",
    expirySeconds
  );
}


export async function getOtp(
  email: string
): Promise<string | null> {
  return await redis.get(`otp:${email}`);
}


export async function deleteOtp(
  email: string
): Promise<number> {
  return await redis.del(`otp:${email}`);
}