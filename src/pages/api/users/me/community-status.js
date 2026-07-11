import { requireUser, toErrorResponse } from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";

export async function GET({ locals }) {
  try {
    const user = requireUser(locals.user);

    const { owned, member, all } = await getUserCommunityContext(user.userId);

    const shape = (c) => ({
      id: c.id,
      name: c.name,
      profileTrack: c.profileTrack,
      stage: c.stage,
    });

    return new Response(
      JSON.stringify({
        hasCommunity: all.length > 0, // ← F-C2: cuenta propias Y membresías
        owned: owned.map(shape),
        member: member.map(shape),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
