import jwt from "jsonwebtoken";

const decodeToken = (token: string | undefined | null) => {
  if (!token) return;
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default decodeToken;
