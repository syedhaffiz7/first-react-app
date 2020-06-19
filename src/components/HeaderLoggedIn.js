import React, { useContext } from "react";
import { Link } from "react-router-dom";

import DispatchContext from "../contexts/DispatchContext";
import StateContext from "../contexts/StateContext";

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function logout() {
    appDispatch({ type: "logout" });
  }

  function openSearch(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <span onClick={openSearch} className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </span>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link className="mr-2" to={`/profile/${appState.user.username}`}>
        <img className="small-header-avatar" alt="avatar" src={appState.user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={logout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
