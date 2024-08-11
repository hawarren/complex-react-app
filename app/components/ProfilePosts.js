import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        console.log("fetchPosts: returned the following ")
        console.log(response.data)
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was an error fetching posts")
      }
    }
    fetchPosts()
  }, [])

  if (isLoading) return <LoadingDotsIcon />
  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate)
        const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        return (
          <Link key={post.id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
            {""}
            <span className="text-muted small">{dateFormatted}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts