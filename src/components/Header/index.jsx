import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {

  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuth);
  const [value, setValue] = React.useState('');
  const [title, setTitle] = React.useState('');

  const onClickLogout = () => {
    if (window.confirm('Are you sure?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  const userData = useSelector(state => state.auth.data);
  const firstName = userData?.fullName?.split(' ')[0] || 'Rubaka';

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>{firstName} BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Create post</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Exit
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Enter</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
