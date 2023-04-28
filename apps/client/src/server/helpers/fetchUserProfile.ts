import { ProfileMetadata, ProfileMetadataSchema } from "@wired-protocol/types";

import { env } from "@/src/env.mjs";
import { parseHandle } from "@/src/utils/parseHandle";

import { prisma } from "../prisma";

export type UserProfile = {
  username: string;
  domain: string;
  metadata: ProfileMetadata;
};

/**
 * Fetches a user's profile given their handle
 */
export async function fetchUserProfile(handle: string): Promise<UserProfile | null> {
  const { username, domain } = parseHandle(handle);
  if (!username || !domain) return null;

  if (domain === env.NEXT_PUBLIC_DEPLOYED_URL) return await fetchUserProfileDB(username);
  else return await fetchUserProfileWired(username, domain);
}

/**
 * Fetches a user's profile from the database
 */
export async function fetchUserProfileDB(username: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.authUser.findUnique({
      where: { username },
      include: { Profile: true },
    });
    if (!user) return null;

    const profile = user.Profile;
    if (!profile) return null;

    return {
      username: user.username,
      domain: env.NEXT_PUBLIC_DEPLOYED_URL,
      metadata: {
        name: profile.name ?? undefined,
        bio: profile.bio ?? undefined,
        image: profile.image ?? undefined,
        background: profile.background ?? undefined,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Fetches a user's profile using the wired protocol
 */
export async function fetchUserProfileWired(
  username: string,
  domain: string
): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${domain}/.wired-protocol/v1/users/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const parsed = ProfileMetadataSchema.safeParse(await res.json());

    if (!parsed.success) return null;

    return {
      username,
      domain,
      metadata: parsed.data,
    };
  } catch {
    return null;
  }
}
