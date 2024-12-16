export async function getUsers(): Promise<[]> {
  try {
    const response = await fetch(`/api/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
