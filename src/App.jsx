import { useState, useEffect, useContext, createContext } from "react";
import LoadingPage from './components/Loader/LoadingPage.jsx';
import RouterPage from './components/RouterPage/RouterPage.jsx';
import './assets/styles/Global.scss';
import { io } from "socket.io-client";
import {getAccountById } from "../src/components/services/AccountService.js";
import Cookies from 'js-cookie';

// Context for socket
export const SocketContext = createContext();

// Custom hook for accessing socket context
export const useSocket = () => useContext(SocketContext);

const App = () => {
  const accountOnlineId = Cookies.get("UserId");
  const [accountOnline, setAccountOnline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    // Show loading for 1 second
    setTimeout(() => setIsLoading(false), 1000);

    // Cleanup: Disconnect socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const account = await getAccountById(accountOnlineId); // Await data fetching
        setAccountOnline(account.userName);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    if (accountOnlineId) {
      fetchAccounts();
    }
  }, [accountOnlineId]);

  // Emit 'newUser' event when socket and accountList are available
  useEffect(() => {
    if (socket) {
      socket.emit("newUser", accountOnline); // Emit current user
    }
  }, [socket, accountOnline]);

  // Show loading page while app is initializing
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <SocketContext.Provider value={{ socket, accountOnline }}>
      <div className="App">
        <RouterPage />
      </div>
    </SocketContext.Provider>
  );
};

export default App;