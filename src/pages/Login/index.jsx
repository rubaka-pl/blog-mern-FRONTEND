import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";


export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))

    if (!data.payload) {
      return alert('Authorization failed. Please check your credentials')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };


  if (isAuth) {
    return <Navigate to='/' />
  }


  console.log('isAuth', isAuth)

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Please enter your email' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          type="password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Please enter your password' })}
          fullWidth
        />
        <Button
          size="large"
          variant="contained"
          fullWidth
          type="submit"
          disabled={!isValid}
        >
          Enter
        </Button>
      </form>
    </Paper>
  );
};
