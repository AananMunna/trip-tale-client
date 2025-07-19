// utils/getRoomId.js
export const getRoomId = (email1, email2) => {
  const sorted = [email1, email2].sort(); // alphabetically
  return `${sorted[0]}_${sorted[1]}`;
};
