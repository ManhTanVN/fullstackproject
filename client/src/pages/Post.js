import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  useEffect(() => {
    axios.get(`http://localhost:3006/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    axios.get(`http://localhost:3006/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const submitComment = () => {
    if (authState.status) {
      if (newComment.trim().length > 0) {
        axios
          .post(
            `http://localhost:3006/comments`,
            {
              commentBody: newComment,
              PostId: id,
            },
            {
              headers: {
                accessToken: sessionStorage.getItem('accessToken'),
              },
            },
          )
          .then((response) => {
            if (response.data.error) {
              alert('You are not logged in yet');
              navigate('/login');
            } else {
              const commentToAdd = {
                commentBody: newComment,
                username: response.data.username,
                PostId: id,
              };
              setComments([...comments, commentToAdd]);
              setNewComment('');
            }
          });
      } else {
        alert('Your comment should not be blank');
      }
    } else {
      alert('Please log in first');
    }
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3006/posts/${id}`, { headers: { accessToken: sessionStorage.getItem('accessToken') } })
      .then((response) => {
        alert('delete success');
        navigate('/');
      });
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title"> {postObject.title} </div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">
            {postObject.userName}
            {authState.status && authState.username === postObject.userName && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={submitComment}>Submit Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> {comment.username}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
