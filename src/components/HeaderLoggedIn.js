import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";

function HeaderLoggedIn() {
  const { setLoggedIn } = useContext(AppContext);

  function logout() {
    setLoggedIn(false);
    localStorage.removeItem("complexAppToken");
    localStorage.removeItem("complexAppUsername");
    localStorage.removeItem("complexAppAvatar");
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <span className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </span>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <span className="mr-2">
        <img className="small-header-avatar" alt="avatar" src={localStorage.getItem("complexAppAvatar")} />
      </span>
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
