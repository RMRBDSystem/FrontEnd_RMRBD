import { useState, useEffect, useContext, createContext } from "react";
import LoadingPage from './components/Loader/LoadingPage.jsx';
import RouterPage from './components/RouterPage/RouterPage.jsx';
import './assets/styles/Global.scss';
import { io } from "socket.io-client";
import {getAccountById } from "../src/components/services/AccountService.js";
import Cookies from 'js-cookie';
import { CartProvider } from './components/Cart/components/CartContext';
import { decryptData } from "./components/Encrypt/encryptionUtils.js";

// Context for socket
export const SocketContext = createContext();

// Custom hook for accessing socket context
export const useSocket = () => useContext(SocketContext);

const App = () => {
  const [accountOnline, setAccountOnline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://socket-db-c8gm.onrender.com");
    // const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    // Show loading for 1 second
    setTimeout(() => setIsLoading(false), 1000);

    // Cleanup: Disconnect socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to fetch account based on UserId from cookies
  const fetchAccount = async () => {
    try {
      const accountOnlineId = decryptData(Cookies.get("UserId"));
      if (accountOnlineId) {
        const account = await getAccountById(accountOnlineId);
        setAccountOnline(account.userName);
      }
    } catch (err) {
      console.error("Error fetching account:", err);
    }
  };

  // Use useEffect to watch for changes in cookies and fetch account
  useEffect(() => {
    fetchAccount(); // Initial fetch

    // Set up an interval to periodically check for changes in cookies
    const interval = setInterval(() => {
      const accountOnlineId = decryptData(Cookies.get("UserId"));
      if (accountOnlineId) {
        fetchAccount();
      }
    }, 1000); // Check every second for changes in the cookie

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Emit 'newUser' event when socket and accountList are available
  useEffect(() => {
    if (socket && accountOnline) {
      socket.emit("newUser", accountOnline); // Emit current user
    }
  }, [socket, accountOnline]);

  // Show loading page while app is initializing
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <CartProvider>
      <SocketContext.Provider value={{ socket, accountOnline }}>
        <div className="App">
          <RouterPage />
        </div>
      </SocketContext.Provider>
    </CartProvider>
  );
};

export default App;