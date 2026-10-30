import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// The public deployment URL is safe to expose in a mobile client.
// Keep credentials and private keys out of EXPO_PUBLIC_* variables.
const CONVEX_URL =
  process.env.EXPO_PUBLIC_CONVEX_URL ??
  "https://grandiose-reindeer-173.convex.cloud";

export function AppProviders({ children }: { children: ReactNode }) {
  const convex = useMemo(() => new ConvexReactClient(CONVEX_URL), []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
