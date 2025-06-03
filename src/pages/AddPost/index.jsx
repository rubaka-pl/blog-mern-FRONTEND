import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from '../../axios';


export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setLoading] = React.useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);


  const handleChangeFile = async (event) => {
    try {

      const formData = new FormData();
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Error while updaing image')
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          const data = res.data;
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении статьи!');
        });
    }
  }, [id]);



  const onClickRemoveImage = async (event) => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);




  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()),
        text,
      };

      let postId;

      if (id) {
        await axios.patch(`/posts/${id}`, fields);
        postId = id;
      } else {
        const { data } = await axios.post('/posts', fields);
        postId = data._id;
      }

      navigate(`/posts/${postId}`);
    } catch (err) {
      console.warn(err);
      alert('edition error!');
    }
  };


  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter a text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if (window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }
  console.log({ title, tags, text })
  return (
    <Paper style={{ padding: 30 }}>
      <Button style={{ margin: 20 }} onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Upload preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {
        imageUrl && (<>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img
            className={styles.image}
            src={imageUrl}
            alt="Uploaded"
          />        </>
        )
      }

      <br />
      <br />
      <TextField
        value={title}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        fullWidth
        onChange={e => setTitle(e.target.value)}
      />
      <TextField value={tags} classes={{ root: styles.tags }} variant="standard" placeholder="Tags" fullWidth onChange={e => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Publish
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper >
  );
};
