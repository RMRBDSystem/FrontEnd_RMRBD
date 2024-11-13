import { useState, useEffect } from "react";
import "./App.css";
import LoadingPage from './components/Loader/LoadingPage.jsx';
import RouterPage from './components/RouterPage/RouterPage.jsx';
import './assets/styles/Global.scss';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="App">
      <RouterPage />
    </div>
  );
};

export default App;
