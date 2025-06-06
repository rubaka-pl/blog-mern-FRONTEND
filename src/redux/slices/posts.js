import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePosts = createAsyncThunk(
    'posts/fetchRemovePosts',
    async (id) => {
        await axios.delete(`/posts/${id}`);
        return id;
    }
);

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })

            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = 'error';
            })

            .addCase(fetchRemovePosts.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(
                    (obj) => obj._id !== action.meta.arg
                );
            })
            .addCase(fetchRemovePosts.fulfilled, (state, action) => {
                // можно лог оставить
                console.log('✅ Post deleted:', action.payload);
            })
            .addCase(fetchRemovePosts.rejected, (state, action) => {
                console.error('❌ Error deleting post:', action.error);
            });
    },
});

export const postsReducer = postsSlice.reducer;
