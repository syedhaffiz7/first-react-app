import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import DispatchContext from "../contexts/DispatchContext";

import Post from "./Post";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);

    return () => document.removeEventListener("keyup", searchKeyPressHandler);

    function searchKeyPressHandler(e) {
      if (e.keyCode === 27) {
        appDispatch({ type: "closeSearch" });
      }
    }
  }, [appDispatch]);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      }); //FIXME: Loading icon isn't visible

      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [setState, state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const request = Axios.CancelToken.source();

      async function fetchResults() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: request.token });

          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (error) {
          console.log("Something went wrong.");
        }
      }

      fetchResults();

      return () => request.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.requestCount]); // dont include 'state.searchTerm' in the dependency array

  function handleInput(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"cicle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show === "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  return <Post post={post} key={post._id} onClick={() => appDispatch({ type: "closeSearch" })} />;
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Sorry, we couldn't find any posts!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
