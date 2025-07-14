// lib//check-pro-user/check-user

export async function fetchProStatus(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    const res = await fetch(`/api/users/status?email=${email}`);
    const data = await res.json();

    // ✅ Only return true if user is active
    return data.status === "active";
  } catch (error) {
    console.error("❌ Failed to fetch pro status:", error);
    return false;
  }
}
