import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Link 已导入
import { Heart, MessageCircle, Share2, MoreHorizontal, Repeat, Send, ArrowLeft } from 'lucide-react';
import { getPin, getComments, addComment, likePin, unlikePin } from '../../services/pinService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import {
  Container,
  PinWrapper,
  ImageSection,
  BackButton,
  ContentSection,
  PinHeader,
  UserInfo,
  UserProfile,
  Avatar,
  Username,
  PinActions,
  ActionButton,
  PinContent,
  PinTitle,
  PinDescription,
  BoardLinkContainer,
  TagsContainer,
  Tag,
  StatsRow,
  SourceInfo,
  CommentsSection,
  CommentsTitle,
  CommentsList,
  Comment,
  CommentAvatar,
  CommentContent,
  CommentHeader,
  CommentUsername,
  CommentTime,
  CommentText,
  NoComments,
  CommentForm,
  CommentInput,
  CommentButton,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  ReturnButton
} from './PinDetail.styles';

// Helper function to format date/time
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);

  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

const PinDetail = () => {
  const { pinId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchPinData = async () => {
      try {
        setLoading(true);
        const response = await getPin(pinId);
        setPin(response.data);
        setIsLiked(response.data.is_liked || false);

        const commentsResponse = await getComments(pinId);
        setComments(commentsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch pin details:', err);
        setError('Failed to load pin details');
        setLoading(false);
      }
    };

    if (pinId) {
      fetchPinData();
    }
  }, [pinId]);

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await unlikePin(pinId);
        setPin(prev => ({
          ...prev,
          likes_received: Math.max(0, (prev.likes_received || 0) - 1)
        }));
      } else {
        await likePin(pinId);
        setPin(prev => ({
          ...prev,
          likes_received: (prev.likes_received || 0) + 1
        }));
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to update like status:', err);
    }
  };

  const handleRepin = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to repin this pin?')) {
      return;
    }

    navigate('/pin/create', {
      state: {
        isRepin: true,
        originPin: pin,
      },
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (commentText.trim() && !submittingComment) {
      try {
        setSubmittingComment(true);
        setCommentError(null);

        const response = await addComment({ pinId, content: commentText });

        setComments(prev => [response.data, ...prev]);
        setCommentText('');
      } catch (err) {
        console.error('Failed to add comment:', err);
        if (err.response && err.response.data && err.response.data.error) {
          setCommentError(err.response.data.error);
        } else {
          setCommentError('Failed to add comment. Please try again later.');
        }
      } finally {
        setSubmittingComment(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  if (error || !pin) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorTitle>Error</ErrorTitle>
          <ErrorMessage>{error || 'Pin not found'}</ErrorMessage>
          <ReturnButton onClick={handleGoBack}>Go Back</ReturnButton>
        </ErrorContainer>
      </Container>
    );
  }

  const imageUrl = pin.picture_detail?.image_url || pin.picture_detail?.image_file;
  const tags = pin.picture_detail?.tags?.split(',').filter(tag => tag.trim()) || [];

  const boardId = pin.board;


  return (
    <Container>
      <PinWrapper>
        <ImageSection>
          <BackButton onClick={handleGoBack} title="Go back">
            <ArrowLeft size={20} />
          </BackButton>
          <img src={imageUrl} alt={pin.title || 'Pin image'} />
        </ImageSection>

        <ContentSection>
          <PinHeader>
            <UserInfo>
              <UserProfile>
                <Avatar>{pin.user?.username.charAt(0).toUpperCase()}</Avatar>
                <Username to={`/user/${pin.user?.username}`}>{pin.user?.username}</Username>
              </UserProfile>

              <PinActions>
                <ActionButton
                  liked={isLiked}
                  onClick={handleLike}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </ActionButton>
                <ActionButton
                  onClick={handleRepin}
                  title="Save"
                >
                  <Repeat size={20} />
                </ActionButton>
                <ActionButton title="Share">
                  <Share2 size={20} />
                </ActionButton>
              </PinActions>
            </UserInfo>

            {pin.is_repin && pin.origin_pin_detail && (
              <SourceInfo>
                Repinned from <Link to={`/pin/${pin.origin_pin_detail.pin_id}`}>original pin</Link>
                (by <Link to={`/user/${pin.origin_pin_detail.user?.username}`}>{pin.origin_pin_detail.user?.username}</Link>)
              </SourceInfo>
            )}
          </PinHeader>

          <PinContent>
            <PinTitle>{pin.title || 'Untitled'}</PinTitle>

            {boardId && (
              <BoardLinkContainer>
                From <Link to={`/board/${boardId}`}>Board</Link>
              </BoardLinkContainer>
            )}


            {pin.description && (
              <PinDescription>{pin.description}</PinDescription>
            )}

            {tags.length > 0 && (
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Tag key={index}>#{tag.trim()}</Tag>
                ))}
              </TagsContainer>
            )}

            <StatsRow>
              <span>{pin.likes_received || 0} likes</span>
              <span>{comments.length} comments</span>
            </StatsRow>
          </PinContent>

          <CommentsSection>
            <CommentsTitle>Comments</CommentsTitle>

            <CommentsList>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <Comment key={comment.comment_id}>
                    <CommentAvatar>
                      {comment.user?.username.charAt(0).toUpperCase()}
                    </CommentAvatar>
                    <CommentContent>
                      <CommentHeader>
                        <CommentUsername>{comment.user?.username}</CommentUsername>
                        <CommentTime>{formatRelativeTime(comment.timestamp)}</CommentTime>
                      </CommentHeader>
                      <CommentText>{comment.content}</CommentText>
                    </CommentContent>
                  </Comment>
                ))
              ) : (
                <NoComments>No comments yet. Be the first to comment!</NoComments>
              )}
            </CommentsList>

            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInput
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submittingComment}
              />
              <CommentButton
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                title="Post comment"
              >
                <Send size={18} />
              </CommentButton>
            </CommentForm>

            {commentError && (
              <ErrorContainer>
                <ErrorMessage>{commentError}</ErrorMessage>
              </ErrorContainer>
            )}
          </CommentsSection>
        </ContentSection>
      </PinWrapper>
    </Container>
  );
};

export default PinDetail;