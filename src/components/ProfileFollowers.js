import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

function ProfileFollowers() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`);
        setFollowers(response.data);
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
      {followers.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" alt="avatar" src={follower.avatar} /> {follower.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowers;
