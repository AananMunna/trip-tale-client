import axios from "axios";

export const saveUserToDB = async (user) => {
  const userInfo = {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    // 🚫 Don't send role anymore!
  };

  try {
    await axios.post("/users", userInfo);
    console.log("✅ User saved or updated");
  } catch (err) {
    console.error("❌ Failed to save user:", err.message);
  }
};

