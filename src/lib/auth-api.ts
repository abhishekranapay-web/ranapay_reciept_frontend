import { useAuthStore } from "@/store/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://service.pavki.in";

/**
 * Get the access token from the store
 */
function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/**
 * Get the authorization headers
 */
function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Request OTP for authentication
 */
export async function requestOTP(): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/receipts/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to request OTP: ${response.statusText}`);
    }

    // Success - OTP has been sent
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
}

/**
 * Verify OTP and get access token
 */
export async function verifyOTP(otp: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/api/receipts/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });

    if (!response.ok) {
      throw new Error(`Failed to verify OTP: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.message === "success" && data.accessToken) {
      // Store the access token in the auth store
      useAuthStore.getState().setAccessToken(data.accessToken);
      return data.accessToken;
    }

    throw new Error("OTP verification failed: Invalid response");
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

/**
 * Logout and clear the access token
 */
export function logout(): void {
  useAuthStore.getState().clearAccessToken();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export { getAuthHeaders };
