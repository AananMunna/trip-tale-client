// import axios from "axios";

import useAxiosSecure from "../hooks/useAxiosSecure";

// export const saveUserToDB = async (user) => {
//   const userInfo = {
//     name: user.displayName,
//     email: user.email,
//     photo: user.photoURL,
//     // 🚫 Don't send role anymore!
//   };
  
//   console.log(userInfo);

//   try {
//     await axios.post("/users", userInfo);
//     console.log("✅ User saved or updated");
//   } catch (err) {
//     console.error("❌ Failed to save user:", err.message);
//   }
// };

export const saveUserToDB = async (user) => {
    const axiosSecure = useAxiosSecure();
  
  const userData = {
    email: user?.email,
    name: user?.displayName || "Unknown User",
    photo: user?.photoURL || "",
  };

  try {
    const res = await axiosSecure.put(`/users/${userData.email}`, userData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to save user:", err);
  }
};


