import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user) {
      if (likes) {
        if (likes.find((like) => like.username === user.username)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      }
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button
        color='teal'
        icon='heart'
        label={{
          basic: true,
          color: 'teal',
          pointing: 'left',
          content: likeCount
        }}
        onClick={likePost}
      />
    ) : (
      <Button
        basic
        color='teal'
        icon='heart'
        label={{
          basic: true,
          color: 'teal',
          pointing: 'left',
          content: likeCount
        }}
        onClick={likePost}
      />
    )
  ) : (
    <Button
      icon='heart'
      color='teal'
      label={{
        basic: true,
        color: 'teal',
        pointing: 'left',
        content: likeCount
      }}
      as={Link}
      to={'/login'}
      basic
    />
  );

  return <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>;
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
