import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios'; // путь к твоему axios-инстансу
import { useSelector } from "react-redux";

export const Index = ({ postId, onAddComment }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector(state => state.auth.data);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/comments', {
        postId,
        text,
      }, {
        headers: {
          Authorization: window.localStorage.getItem('token'),
        },
      });

      setText('');
      onAddComment?.(data);
    } catch (err) {
      console.warn('Ошибка при отправке комментария', err);
      alert('Ошибка при отправке комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={user?.avatarUrl || "https://mui.com/static/images/avatar/5.jpg"}
      />
      <div className={styles.form}>
        <TextField
          label="Add a comment"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={isSubmitting} variant="contained">
          Add a comment
        </Button>
      </div>
    </div>
  );
};
