import React from 'react';
import 'antd/dist/antd.min.css';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import NewComparison from "./features/Home/NewComparison";
import Comparison from "./features/Home/Comparision";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact component={Comparison} />
          <Route path="/new-comparison" exact component={NewComparison} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
