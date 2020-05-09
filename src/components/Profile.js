import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import StateContext from "../contexts/StateContext";

import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "http://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: {
      postCount: "",
      followerCount: "",
      followingCount: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token });
        setProfileData(response.data);
      } catch (e) {
        console.error("Error while fetching data.");
      }
    }

    fetchData();
  }, [appState.user.token, username]);

  return (
    <Page title="My Profile">
      <h2>
        <img className="avatar-small" alt="avatar" src={profileData.profileAvatar} /> {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <Link to="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </Link>
      </div>

      <ProfilePosts></ProfilePosts>
    </Page>
  );
}

export default Profile;
