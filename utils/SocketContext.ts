import { createContext } from "react";

import { io } from "socket.io-client";

export const socket = io("http://localhost:7777");

export const SocketContext = createContext(socket);
