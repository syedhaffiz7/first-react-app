import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

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
        const date = new Date(post.createdDate);
        const dateFormatted = `${date.getMonth() + 1} /${date.getDate()}/${date.getFullYear()}`;
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" alt="avatar" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small"> on {dateFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;