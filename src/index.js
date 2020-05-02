import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

//App related components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";

function ComplexApp() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Switch>
        <Route path="/" exact>
          <HomeGuest></HomeGuest>
        </Route>
        <Route path="/about-us">
          <About></About>
        </Route>
        <Route path="/terms">
          <Terms></Terms>
        </Route>
      </Switch>
      <Footer></Footer>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ComplexApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
