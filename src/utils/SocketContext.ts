import { createContext } from "react";

import { io } from "socket.io-client";

export const socket = io("https://victorious-ox-dress.cyclic.app");

export const SocketContext = createContext(socket);
