import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      fullName: 'John Doe',
      email: 'JohnTest@gmail.com',
      password: '123456',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      const response = await dispatch(fetchRegister(values));

      if (!response.payload) {
        if (response.error?.message?.includes('400')) {
          return alert('A user with this email or password already exists.');
        }

        return alert('Registration failed. Please check your data.');
      }

      if ('token' in response.payload) {
        window.localStorage.setItem('token', response.payload.token);
      }
    } catch (err) {
      alert('Something went wrong. Please try again later.');
    }
  };


  if (isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Write you`re full name' })}
          className={styles.field} label="Full Name" fullWidth
        />
        <TextField error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Write email' })}
          className={styles.field} label="E-Mail" fullWidth />
        <TextField error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Please enter your password' })}
          className={styles.field} label="Password" fullWidth />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
