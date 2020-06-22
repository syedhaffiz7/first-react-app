import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, Link, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import StateContext from "../contexts/StateContext";
import DispatchContext from "../contexts/DispatchContext";

import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";

function ViewSinglePost(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function getPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: request.token });
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.error("Error while getting posts");
      }
    }

    getPost();

    return () => {
      request.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound></NotFound>;
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingIcon></LoadingIcon>
      </Page>
    );
  }

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }

    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?");

    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } });

        if (response.data === "Success") {
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted." });
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("Something went wrong," + error);
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>

        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="edit-post-button mr-2 text-primary">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip"></ReactTooltip>{" "}
            <span onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </span>
            <ReactTooltip id="delete" className="custom-tooltip"></ReactTooltip>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" alt="avatar" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {new Date(post.createdDate).toLocaleDateString()}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "listItem", "strong", "blockquote", "emphasis", "heading", "link", "text"]}></ReactMarkdown>
      </div>
    </Page>
  );
}

export default withRouter(ViewSinglePost);
