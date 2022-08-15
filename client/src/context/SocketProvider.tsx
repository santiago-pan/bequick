import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
});

type SocketProviderProps = {
  children: React.ReactNode;
};

function connect() {
  return io("wss://s2.pancarneiro.com");
}

export default function SocketProvider(props: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket === null) {
      setSocket(connect());
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}
