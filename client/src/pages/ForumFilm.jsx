import axios from "axios";
import { useState, useEffect } from "react";
import "./ForumFilm.css";
import { useNavigate, useLocation } from "react-router-dom";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const apiUrl = import.meta.env.VITE_APP_API_URL;

function ForumFilm() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const movieId = location.state?.mId;
  const [Detail, setDetail] = useState(null);
  const navigate = useNavigate();
  const [isReplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [fixComment, setFixComment] = useState("");
  const [firstComment, setFirstComment] = useState("");

  const handleMovieClick = () => {
    navigate(`/film/${movieId}`);
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleFixedSubmitComment = () => {
    if (fixComment.trim()) {
      setComments([...comments, fixComment]);
      setFixComment("");
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/movie/${movieId}?Language=en-US&api_key=${apiKey}`)
      .then((response) => {
        setDetail(response.data);
      });

    axios
      .get(`${apiUrl}/movie/${movieId}/reviews?api_key=${apiKey}`)
      .then((response) => {
        const reviews = response.data.results;
        if (reviews.length > 0) {
          setFirstComment(reviews[0].content);
        }
      });
  }, [movieId]);

  if (!Detail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Header">
      <div className="titleFilm">
        <h1 className="title">{Detail.title}</h1>
      </div>

      <div className="banner">
        <img
          className="bannerMovieForum"
          src={`https://image.tmdb.org/t/p/original${Detail.backdrop_path}`}
          alt={Detail.title}
        />
      </div>

      <div className="info">
        <h2
          onClick={() => handleMovieClick(movieId)}
          onKeyDown={handleMovieClick}
          role="presentation"
          className="infoFilm"
        >
         Movie information
        </h2>
      </div>

      <div className="content">
        <div className="text">{firstComment}</div>
        <div className="dateReponse">
          <p className="date">Posted on {new Date().toLocaleDateString()}</p>
          <button type="button" className="reponse" onClick={handleReplyClick}>
            Answer
          </button>
        </div>
      </div>

      {comments.map((comment) => (
        <div className="content" key={comment}>
          <div className="name">Anonymous</div>

          <div className="text">{comment}</div>

          <div className="dateReponse">
            <p className="date">Posted on {new Date().toLocaleDateString()} </p>
            <button
              type="button"
              className="reponse"
              onClick={handleReplyClick}
            >
              Answer
            </button>
          </div>
        </div>
      ))}

      {isReplying && (
        <div className="addComment">
          <textarea
            className="contentRep"
            placeholder="Answer here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="buttonDiv">
            <button
              type="button"
              className="buttonComment"
              onClick={handleSubmitComment}
            >
              Comment
            </button>
          </div>
        </div>
      )}

      <div className="addCommentFix">
        <textarea
          className="contentFix"
          placeholder="Chat here..."
          value={fixComment}
          onChange={(e) => setFixComment(e.target.value)}
        />
        <div className="buttonDiv">
          <button
            type="button"
            className="buttonComment"
            onClick={handleFixedSubmitComment}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForumFilm;
