import { httpService } from "./http.service";

export const authService = {
  login,
  register,
  logout,
  getUser,
};

async function login(email: string, password: string) {
  const response = await httpService.post("/auth/login", { email, password });
  localStorage.setItem("token", response.access_token);
  return response.user;
}

async function register(email: string, password: string) {
  const response = await httpService.post("/auth/register", {
    email,
    password,
  });
  localStorage.setItem("token", response.access_token);
  return response.user;
}

async function logout() {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
}

async function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Decode JWT to get user info (basic client-side parsing)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email
    };
  } catch (error) {
    console.error("Failed to parse token:", error);
    return null;
  }
}
