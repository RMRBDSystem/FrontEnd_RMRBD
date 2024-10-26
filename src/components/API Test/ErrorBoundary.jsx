import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AccountManagement from './AccountManagement';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Switch>
          <Route path="/account-management" component={AccountManagement} />
          {/* Add other routes here */}
        </Switch>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
