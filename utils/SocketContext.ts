import { createContext } from "react";

import { io } from "socket.io-client";

export const socket = io("https://soundy-backend-production.up.railway.app");

export const SocketContext = createContext(socket);
