import React, { useState, useEffect } from 'react'; // 确保导入 useEffect
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { likePin, unlikePin } from '../../services/pinService';

// ... (styled-components 定义保持不变)
const PinContainer = styled.div`
  margin-bottom: 16px;
  break-inside: avoid;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s;
  background-color: #f0f0f0;

  &:hover {
    transform: scale(1.02);
    .pin-overlay-content {
      opacity: 1;
    }
  }
`;

const PinImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  cursor: pointer;
  min-height: 50px;
  background-color: #e0e0e0;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
  border-radius: 16px;
`;

const PinOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
`;

const PinOverlayContent = styled.div`
  background: linear-gradient(to bottom, transparent 20%, rgba(0, 0, 0, 0.6) 80%);
  opacity: 0;
  transition: opacity 0.2s;
  padding: 1rem;
  pointer-events: auto;
  width: 100%;
`;

const PinActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PinButton = styled.button`
  background-color: ${props => props.primary ? '#e60023' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  
  &:hover {
    background-color: ${props => props.primary ? '#ad081b' : '#f0f0f0'};
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const PinLikeButton = styled(PinButton)`
  background-color: ${props => props.liked ? '#e60023' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.liked ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.liked ? '#ad081b' : '#f0f0f0'};
  }
`;

const PinDetails = styled.div`
  color: white;
  margin-bottom: 0.5rem;
`;

const PinTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 600;
`;

const PinUser = styled.p`
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
`;


const PinItem = ({ pin }) => {
  // 1. 调用所有 Hooks 在组件的顶层，无条件地
  const { currentUser } = useAuth(); // 自定义 Hook
  const [liked, setLiked] = useState(false); // 初始默认值
  const [likeCount, setLikeCount] = useState(0); // 初始默认值
  const [imageError, setImageError] = useState(false); // 初始默认值

  // 2. 使用 useEffect 来根据 pin prop 初始化/更新状态
  useEffect(() => {
    if (pin && pin.pin_id) {
      // 假设 pin 对象中有一个字段指示当前用户是否已点赞，例如 pin.liked_by_current_user
      setLiked(pin.is_liked || false);
      setLikeCount(pin.like_received || 0);
      setImageError(false); // 如果 pin 更新了，重置图片错误状态
    } else {
      // 如果 pin 变为无效，也可以选择重置状态
      setLiked(false);
      setLikeCount(0);
      setImageError(false); // 或者 true 如果你想显示占位符
    }
  }, [pin]); // 依赖项数组包含 pin，当 pin prop 改变时，此 effect会重新运行

  // 3. 提前返回的逻辑现在位于所有 Hook 调用之后
  if (!pin || !pin.pin_id) {
    return (
      <PinContainer>
        <ImagePlaceholder>图钉数据加载失败</ImagePlaceholder>
      </PinContainer>
    );
  }

  // 后续的组件逻辑...
  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      console.log('用户未登录，无法点赞');
      return;
    }

    try {
      if (liked) {
        await unlikePin(pin.pin_id);
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likePin(pin.pin_id);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('点赞/取消点赞操作失败:', error);
    }
  };

  const imageUrl = pin.picture_detail?.image_url || pin.picture_detail?.image_file;
  const imageAlt = pin.picture_detail?.tags ?? pin.title ?? '图钉图片';
  const pinTitle = pin.title ?? '无标题';
  const pinUsername = pin.user?.username || '用户';

  return (
    <PinContainer>
      <Link to={`/pin/${pin.pin_id}`} style={{ textDecoration: 'none' }}>
        {!imageError && imageUrl ? (
          <PinImage
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder>{imageUrl ? '图片加载失败' : '无可用图片'}</ImagePlaceholder>
        )}

        <PinOverlay>
          <PinOverlayContent className="pin-overlay-content">
            <PinDetails>
              <PinTitle title={pinTitle}>{pinTitle}</PinTitle>
              <PinUser>由 {pinUsername} 钉入</PinUser>
            </PinDetails>

            <PinActions>
              <PinLikeButton
                liked={liked}
                onClick={handleLikeToggle}
                aria-label={liked ? '取消点赞' : '点赞'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {likeCount > 0 && <span style={{ marginLeft: '0.25rem' }}>{likeCount}</span>}
              </PinLikeButton>

              {currentUser && (
                <PinButton
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('保存 Pin:', pin.pin_id);
                  }}
                  aria-label="保存图钉"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" fill="currentColor" />
                  </svg>
                  保存
                </PinButton>
              )}
            </PinActions>
          </PinOverlayContent>
        </PinOverlay>
      </Link>
    </PinContainer>
  );
};

export default PinItem;