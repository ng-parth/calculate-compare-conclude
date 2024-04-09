import React from 'react';
import 'antd/dist/antd.min.css';
import './App.scss';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Comparison from "./features/Home/Comparision";
import Details from "./features/Details/Details";
import WaMe from './features/WaMe/WaMe';
import logo from './assets/logos/compare192.png'
import post from "axios";

function onLogin (userResp) {
  debugger
  post('http://localhost:3030/login/', userResp).then(resp => {
    debugger
    console.log('Success: ', resp);
  }).catch(e => {
    console.log('Err: ', e);
  });
  console.log('OnLogin: ', userResp);
}
window.onLogin = onLogin;
// data-callback="onLogin"
function App() {
  return (
    <div className="app">
      <img src={logo} className="logo--main" alt="Logo" />
      <div id="g_id_onload"
           data-client_id="371583027244-iu86cqaqjsj68t0t5co7od5oo5irch17.apps.googleusercontent.com"
           data-context="signin"
           data-ux_mode="popup"
           // data-ux_mode="redirect"
           // data-login_uri="http://localhost:8090/auth/login"
           data-callback="onLogin"
           data-auto_prompt="true">
      </div>
      <div className="g_id_signin"
           data-type="standard"
           data-shape="rectangular"
           data-theme="filled_blue"
           data-text="signin_with"
           data-logo_alignment="left">
      </div>
      <Router>
        <Switch>
          <Route path="/" exact component={Comparison} />
          <Route path="/wa.me" exact component={WaMe} />
          <Route path="/details/:comparisonId" exact component={Details} />
          <Route path="/auth/login" exact>
            Hello World!!
            Auth Login Page
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
