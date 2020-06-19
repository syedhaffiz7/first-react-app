import React, { useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, Link, withRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import StateContext from "../contexts/StateContext";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import DispatchContext from "../contexts/DispatchContext";
import NotFound from "./NotFound";

function EditPost(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isLoading: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "getComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isLoading = false;
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestCompleted":
        draft.isSaving = false;
        return;
      case "titleRule":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        return;
      case "bodyRule":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide the body content.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function savePost(e) {
    e.preventDefault();
    dispatch({ type: "titleRule", value: state.title.value });
    dispatch({ type: "bodyRule", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function getPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: request.token });
        if (response.data) {
          dispatch({ type: "getComplete", value: response.data });
          if (appState.user.username !== response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit this post." });
            props.history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.error("Error while getting posts");
      }
    }

    getPost();

    return () => {
      request.cancel();
    };
  }, [dispatch, state.id]);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({
        type: "saveRequestStarted",
      });
      const request = Axios.CancelToken.source();

      async function savePost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            { cancelToken: request.token }
          );

          dispatch({
            type: "saveRequestCompleted",
          });

          appDispatch({
            type: "flashMessage",
            value: "Post is updated.",
          });
        } catch (e) {
          console.error("Error while getting posts");
        }
      }

      savePost();

      return () => {
        request.cancel();
      };
    }
  }, [appDispatch, appState.user.token, dispatch, state.body.value, state.id, state.sendCount, state.title.value]);

  if (state.notFound) {
    return <NotFound></NotFound>;
  }

  if (state.isLoading) {
    return (
      <Page title="...">
        <LoadingIcon></LoadingIcon>
      </Page>
    );
  }

  return (
    <Page title="Edit">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        {" "}
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={savePost}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRule", value: e.target.value })} onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" value={state.title.value} />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRule", value: e.target.value })} onChange={(e) => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save
        </button>
      </form>
    </Page>
  );
}

export default withRouter(EditPost);
