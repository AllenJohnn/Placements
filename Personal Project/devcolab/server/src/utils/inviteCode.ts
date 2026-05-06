import { v4 as uuidv4 } from "uuid";

export function generateInviteCode(): string {
  return uuidv4().split("-")[0].toUpperCase(); // 8 chars like "ABCD1234"
}
