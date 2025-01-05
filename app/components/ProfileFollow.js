import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import FlashMessages from "./FlashMessages"

function ProfileFollow(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, { CancelToken: ourRequest.token })
        console.log("fetchPosts: returned the following ")
        console.log(`${props.action} is the action called`)
        console.log(response.data)
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was an error fetching posts")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading) return <LoadingDotsIcon />
  //if no followers, return a message saying you have no followers yet.
  console.log(`is same user ${props.isSameUser}`)
  if (props.counts === 0 || props.isSameUser) return <div>You have no {props.action} yet</div>
  if (props.counts === 0 || !props.isSameUser) return <div>They have no {props.action} yet</div>
  //if no following, return a message saying you are not following anyone yet.
  //if it's the followers page, return a message saying this user has no followers yet.
  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollow
