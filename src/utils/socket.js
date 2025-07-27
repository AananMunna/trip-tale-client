// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://trip-tale-server.vercel.app"); // 👉 live হলে replace with your hosted backend

export default socket;
