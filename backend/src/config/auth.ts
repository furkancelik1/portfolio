export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "supersecret-jwt-key-2026",
  jwtExpiresIn: "7d",
};
