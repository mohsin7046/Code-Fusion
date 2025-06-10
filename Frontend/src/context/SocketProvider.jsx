import {useContext,createContext,useMemo} from 'react'
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

const SocketContext = createContext();

export const useSocket = () =>{
    const socket = useContext(SocketContext);
    return socket;
}

function SocketProvider({children}) {
  const socket = useMemo(() => io('http://localhost:3000'),[] );

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}
SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketProvider