// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // 👉 live হলে replace with your hosted backend

export default socket;
