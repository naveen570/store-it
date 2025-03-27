import { avatarPlaceholderURL } from "@/constants";
import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string(),
  account_id: z.string(),
  email: z.string().email(),
  avatar: z.string().optional().default(avatarPlaceholderURL),
});
export type User = z.infer<typeof userSchema>;
