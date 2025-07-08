// utils/saveUserToDB.js
import axios from "axios";
import useAxiosSecure from "../hooks/useAxiosSecure";

export const saveUserToDB = async (user) => {
  const axiosSecure = useAxiosSecure();
  const userInfo = {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    role: "tourist",
  };

  try {
    const res = await axiosSecure.post("/users", userInfo);
    console.log("✅ User saved or updated:", res.data);
  } catch (err) {
    console.error("❌ Failed to save user:", err.message);
  }
};
