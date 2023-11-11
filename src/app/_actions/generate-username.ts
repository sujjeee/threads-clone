"use server"

import { getUserEmail } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server"
import type { UserResource } from "@clerk/types"

export async function generateUsername(user: UserResource | User | null) {
    const email = getUserEmail(user);
    const usernameMatch = email.match(/^(.+)@/);

    if (!usernameMatch) {
        throw new Error("Invalid email format");
    }

    const originalUsername = usernameMatch[1];
    const cleanUsername = originalUsername?.replace(/[\+.]/g, "");

    let username = cleanUsername;

    const user_list = await clerkClient.users.getUserList();

    // Check if the username is available in the list
    let isUsernameTaken = user_list.some((user) => user.username === username);

    if (!isUsernameTaken) {
        return username;
    }

    // If not available, add an underscore and recheck
    username += "_";
    isUsernameTaken = user_list.some((user) => user.username === username);

    if (!isUsernameTaken) {
        return username;
    }

    // If still not available, add "01" or increment a number
    let index = 1;
    while (isUsernameTaken) {
        index += 1;
        username = `${cleanUsername}${index.toString().padStart(2, "0")}`;
        isUsernameTaken = user_list.some((user) => user.username === username);
    }

    return username;
}