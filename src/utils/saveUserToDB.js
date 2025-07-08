// utils/saveUserToDB.js
import axios from "axios";

export const saveUserToDB = async (user) => {
  const userInfo = {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    role: "tourist",
  };

  try {
    const res = await axios.post("http://localhost:3000/users", userInfo);
    console.log("✅ User saved or updated:", res.data);
  } catch (err) {
    console.error("❌ Failed to save user:", err.message);
  }
};
