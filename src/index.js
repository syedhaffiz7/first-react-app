import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

//App related components
import AppContext from "./context/AppContext";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

Axios.defaults.baseURL = "http://localhost:8080";

function ComplexApp() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexAppToken") && localStorage.getItem("complexAppUsername")));
  const [flashMessages, setFlashMessages] = useState([]);

  function addFlashMessage(msg) {
    setFlashMessages((prev) => prev.concat(msg));
  }

  return (
    <AppContext.Provider value={{ addFlashMessage, setLoggedIn }}>
      <BrowserRouter>
        <FlashMessages messages={flashMessages} />
        <Header loggedIn={loggedIn}></Header>
        <Switch>
          <Route path="/" exact>
            {loggedIn ? <Home /> : <HomeGuest />}
          </Route>
          <Route path="/create-post">
            <CreatePost></CreatePost>
          </Route>
          <Route path="/post/:id">
            <ViewSinglePost></ViewSinglePost>
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
    </AppContext.Provider>
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
