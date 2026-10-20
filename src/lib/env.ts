/** True on `pnpm dev` and Vercel preview deployments — placeholder tags and [[TBD]] highlights show only here. */
export const isPreview =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
