
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@team-up/api";

export const trpc = createTRPCReact<AppRouter>();
