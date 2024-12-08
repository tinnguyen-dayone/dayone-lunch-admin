import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const client = await clerkClient();
  try {
    const users = await client.users.getUserList();
    return Response.json({ response: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
