import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

function ProfileFollowing() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/following`);
        setFollowings(response.data);
        setIsLoading(false);
      } catch (e) {
        console.error("Error while getting posts.");
      }
    }

    getPosts();
  }, [username]);

  if (isLoading) {
    return <LoadingIcon></LoadingIcon>;
  }

  return (
    <div className="list-group">
      {followings.map((followings, index) => {
        return (
          <Link key={index} to={`/profile/${followings.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" alt="avatar" src={followings.avatar} /> {followings.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowing;
