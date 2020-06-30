import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import Post from "./Post";

function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`);
        setPosts(response.data);
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
      {posts.map((post) => {
        return <Post post={post} key={post._id} noAuthor={true} />;
      })}
    </div>
  );
}

export default ProfilePosts;
