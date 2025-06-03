import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { fetchRemovePosts } from '../redux/slices/posts';
import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { } from '../redux/slices/posts';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag'); // выбранный тег из URL
  const [tabIndex, setTabIndex] = React.useState(0);
  const [latestComments, setLatestComments] = React.useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data)
  const { posts, tags } = useSelector(state => state.posts)

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const navigate = useNavigate();

  const onClickRemove = (id) => {
    if (window.confirm('Delete post?')) {
      dispatch(fetchRemovePosts(id));
    }
  };

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags())
  }, [dispatch])

  React.useEffect(() => {
    axios
      .get('/comments/last')
      .then((res) => {
        setLatestComments(res.data);
      })
      .catch((err) => {
        console.warn('Error loading comments:', err);
      })
      .finally(() => {
        setIsCommentsLoading(false); // всегда вызывается
      });
  }, []);

  console.log(posts)
  if (!posts || !tags) return <p>Loading state not ready</p>;

  let filteredPosts = [...posts.items];

  if (selectedTag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(selectedTag));
  }
  if (tabIndex === 1) {
    filteredPosts.sort((a, b) => b.viewsCount - a.viewsCount);
  } else {
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return (

    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>

          {(isPostsLoading ? [...Array(5)] : filteredPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />) :

              (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl ||
                    "https://www.pbs.org/wnet/nature/files/2014/10/Monkey-Main-1280x720.jpg"
                  } user={obj.user}
                  createdAt={new Date(obj.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.comments?.length || 0} tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                  onClickRemove={() => onClickRemove(obj._id)}
                  onClickEdit={() => navigate(`/posts/${obj._id}/edit`)} />
              ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} onTagClick={(tag) => setSearchParams({ tag })} />
          <CommentsBlock
            items={latestComments}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
