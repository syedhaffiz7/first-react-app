import React, { useEffect, useContext } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import StateContext from "../contexts/StateContext";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import DispatchContext from "../contexts/DispatchContext";

function EditPost() {
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
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "getComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isLoading = false;
        return;
      case "titleChange":
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.value = action.value;
        return;
      case "submitRequest":
        draft.sendCount++;
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestCompleted":
        draft.isSaving = false;
        return;
      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function savePost(e) {
    e.preventDefault();

    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function getPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: request.token });
        dispatch({ type: "getComplete", value: response.data });
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
  }, [appState.user.token, dispatch, state.body.value, state.id, state.sendCount, state.title.value]);

  if (state.isLoading) {
    return (
      <Page title="...">
        <LoadingIcon></LoadingIcon>
      </Page>
    );
  }

  return (
    <Page title="Edit">
      <form onSubmit={savePost}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" value={state.title.value} />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
