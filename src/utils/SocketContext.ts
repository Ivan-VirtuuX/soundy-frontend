import { createContext } from "react";

import { io } from "socket.io-client";

export const socket = io("https://byzantium-lovebird-veil.cyclic.app");

export const SocketContext = createContext(socket);
