import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link, useNavigate } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkDown from "react-markdown"
import { Tooltip as ReactTooltip } from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        console.log("fetchPost: returned the following ")
        console.log(response.data)
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was an error fetching a post, or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
  if (!isLoading && !post) return <NotFound />

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  function IsOwner() {
    if (appState.loggedIn) {
      if (appState.user.username == post.author.username) {
        return true
      }
    }
    return false
  }
  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          //1. display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted." })
          //2. redirect to current users profile
          navigate(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log("There was a problem.")
        console.log(ex)
      }
    }
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {IsOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tooltip-content="Edit this" data-tooltip-id="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tooltip-content="Delete" data-tooltip-id="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkDown children={post.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol"]} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
