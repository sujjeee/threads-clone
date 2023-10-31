import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "@clerk/nextjs/server"
import { UserResource } from "@clerk/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserEmail(user: UserResource | User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  return email
}

export function emailToUsername(user: UserResource | User | null) {
  const email = getUserEmail(user);
  const usernameMatch = email.match(/^(.+)@/);

  if (usernameMatch) {
    const username = usernameMatch[1]!;
    const newUsername = username.replace(/[\+.]/g, "")
    return newUsername;
  } else {
    const firstName = user?.firstName ?? "";
    const lastName = user?.lastName ?? "";
    return `${firstName}${lastName}`.toLowerCase();
  }
}

export function formatURL(originalURL: string) {
  // Remove 'http://' or 'https://' if it exists
  let cleanedURL = originalURL.replace(/^(https?:\/\/)?(www\.)?/, '');

  // Remove leading 'www.'
  cleanedURL = cleanedURL.replace(/^(www\.)?/, '');

  // Extract the domain/route
  const parts = cleanedURL.split('/');
  if (parts.length >= 2) {
    // Join the first two parts to get 'domain/route'
    return parts.slice(0, 2).join('/');
  } else {
    return cleanedURL;
  }
}