import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from '../axios';
import ReactMarkdown from "react-markdown";


export const FullPost = () => {
  const [data, setData] = useState(null);           // null по умолчанию
  const [isLoading, setLoading] = useState(true);   // true по умолчанию
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    setLoading(true);
    axios.get(`/posts/${id}`).then((res) => {
      setData(res.data);
      setLoading(false);
    });

    axios.get(`/comments/post/${id}`).then(res => {
      setComments(res.data);
      setIsCommentsLoading(false);
    });
  }, [id]);
  // Если данные ещё загружаются
  if (isLoading || !data) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={
          data.imageUrl ||
          "https://www.pbs.org/wnet/nature/files/2014/10/Monkey-Main-1280x720.jpg"
        }
        user={{
          ...data.user,
          avatarUrl: data.user.avatarUrl || "https://mui.com/static/images/avatar/1.jpg"
        }}
        createdAt={new Date(data.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        viewsCount={data.viewsCount || 0}
        commentsCount={data.comments?.length || 0}
        tags={data.tags || []}
        isFullPost
      >
        <ReactMarkdown>{data.text || "Нет текста"}</ReactMarkdown>
      </Post>

      <CommentsBlock
        items={comments}
        isLoading={isCommentsLoading}
      >
        <Index
          postId={id}
          onAddComment={(newComment) => setComments(prev => [...prev, newComment])}
        />      </CommentsBlock>
    </>
  );
};
