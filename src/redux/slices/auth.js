import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (_, thunkAPI) => {
    try {
        const { data } = await axios.get('/auth/me');
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

const initialState = {
    data: null,
    status: 'loading',
};

const handleAsyncThunk = (builder, thunk) => {
    builder
        .addCase(thunk.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        })
        .addCase(thunk.rejected, (state) => {
            state.status = 'error';
            state.data = null;
        });
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunk(builder, fetchAuth);
        handleAsyncThunk(builder, fetchAuthMe);
        handleAsyncThunk(builder, fetchRegister);
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
