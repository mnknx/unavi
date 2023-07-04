import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_CDN_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_CRYPTOAVATARS_API_KEY: z.string().optional(),
    NEXT_PUBLIC_DEFAULT_HOST: z.string(),
    NEXT_PUBLIC_DEPLOYED_URL: z.string().url(),
    NEXT_PUBLIC_DOCS_URL: z.string().url(),
    NEXT_PUBLIC_HAS_DATABASE: z.boolean(),
    NEXT_PUBLIC_HAS_GOOGLE_OAUTH: z.boolean(),
    NEXT_PUBLIC_HAS_S3: z.boolean(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DISABLE_PWA: process.env.DISABLE_PWA,
    ETH_PROVIDER: process.env.ETH_PROVIDER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT:
      process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT,
    NEXT_PUBLIC_CDN_ENDPOINT: process.env.NEXT_PUBLIC_CDN_ENDPOINT,
    NEXT_PUBLIC_CRYPTOAVATARS_API_KEY:
      process.env.NEXT_PUBLIC_CRYPTOAVATARS_API_KEY,
    NEXT_PUBLIC_DEFAULT_HOST: process.env.NEXT_PUBLIC_DEFAULT_HOST,
    NEXT_PUBLIC_DEPLOYED_URL: process.env.NEXT_PUBLIC_DEPLOYED_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_HAS_DATABASE: process.env.NEXT_PUBLIC_HAS_DATABASE === "true",
    NEXT_PUBLIC_HAS_GOOGLE_OAUTH:
      process.env.NEXT_PUBLIC_HAS_GOOGLE_OAUTH === "true",
    NEXT_PUBLIC_HAS_S3: process.env.NEXT_PUBLIC_HAS_S3 === "true",
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NODE_ENV: process.env.NODE_ENV,
    PLANETSCALE: process.env.PLANETSCALE === "true",
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_SECRET: process.env.S3_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  server: {
    DATABASE_URL: z.string().url().optional(),
    DISABLE_PWA: z.string().optional(),
    ETH_PROVIDER: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    PLANETSCALE: z.boolean(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_SECRET: z.string().optional(),
    VERCEL_URL: z.string().optional(),
  },
});
