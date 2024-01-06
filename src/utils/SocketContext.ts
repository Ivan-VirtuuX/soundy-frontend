import { createContext } from "react";

import { io } from "socket.io-client";

export const socket = io("https://soundy-backend.onrender.com");
export const SocketContext = createContext(socket);
