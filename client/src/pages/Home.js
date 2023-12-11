import React, { useContext } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
  const { authState } = useContext(AuthContext);
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:3006/posts').then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  const likeAPost = (postId, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (authState.status) {
      axios
        .post(
          'http://localhost:3006/likes',
          { PostId: postId },
          { headers: { accessToken: sessionStorage.getItem('accessToken') } },
        )
        .then((response) => {
          setListOfPosts(
            listOfPosts.map((post) => {
              if (post.id === postId) {
                if (response.data.liked) {
                  return {
                    ...post,
                    Likes: [...post.Likes, { PostId: response.data.PostId, UserId: response.data.UserId }],
                  };
                } else {
                  const likesArray = post.Likes.filter((like) => {
                    return like.PostId !== response.data.PostId && like.UserId !== response.data.UserId;
                  });
                  return { ...post, Likes: likesArray };
                }
              } else {
                return post;
              }
            }),
          );
        });
    } else {
      alert('Please login to like the post');
    }
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div
            key={key}
            className="post"
            onClick={() => {
              console.log(value.id);
              navigate(`/post/${value.id}`);
            }}
          >
            <div className="title"> {value.title} </div>
            <div className="body">{value.postText}</div>
            <div className="footer">
              <div className="username">{value.userName}</div>
              <div className="buttons">
                <ThumbUpIcon
                  onClick={(event) => {
                    likeAPost(value.id, event);
                  }}
                  className={
                    typeof value.Likes.find((like) => like.UserId === authState.id) !== 'undefined' && authState.status
                      ? 'unlikeBttn'
                      : 'likeBttn'
                  }
                />
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
