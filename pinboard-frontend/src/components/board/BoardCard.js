import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getBoardPins } from '../../services/pinService';

// 样式定义
const CardContainer = styled(Link)`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ThumbnailContainer = styled.div`
  height: 150px;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImagePlaceholder = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
`;

const InfoContainer = styled.div`
  padding: 1rem;
`;

const BoardName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const BoardStats = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

// 干净的BoardCard组件，无调试代码
const BoardCard = ({ board }) => {
  // 所有hooks在顶层调用
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // 组件挂载后获取封面图片
  useEffect(() => {
    // 如果没有board数据，不执行任何操作
    if (!board) {
      setLoading(false);
      return;
    }

    // 定义异步函数获取封面
    const fetchCoverImage = async () => {
      // 如果已经有封面图片，直接使用
      if (board.cover_image) {
        setCoverImage(board.cover_image);
        setLoading(false);
        return;
      }

      try {
        // 获取pins
        const response = await getBoardPins(board.board_id);
        const pins = response.data;
        
        if (pins && pins.length > 0) {
          // 检查多种可能的图片URL位置
          let imageUrl = null;
          
          // 检查不同的可能路径
          if (pins[0].picture_detail && pins[0].picture_detail.image_url) {
            imageUrl = pins[0].picture_detail.image_url;
          } else if (pins[0].picture_detail && pins[0].picture_detail.image_file) {
            imageUrl = pins[0].picture_detail.image_file;
          } else if (pins[0].picture && typeof pins[0].picture === 'object') {
            imageUrl = pins[0].picture.image_url || pins[0].picture.image_file;
          } else if (pins[0].picture && typeof pins[0].picture === 'string') {
            imageUrl = pins[0].picture;
          }
          
          if (imageUrl) {
            setCoverImage(imageUrl);
          }
        }
      } catch (error) {
        // 错误处理
      } finally {
        setLoading(false);
      }
    };

    // 执行获取封面的函数
    fetchCoverImage();
  }, [board]);

  // 如果没有board数据，返回null
  if (!board) {
    return null;
  }

  return (
    <CardContainer to={`/board/${board.board_id}`}>
      <ThumbnailContainer>
        {loading ? (
          <NoImagePlaceholder>
            Loading...
          </NoImagePlaceholder>
        ) : coverImage ? (
          <CoverImage src={coverImage} alt={board.board_name} />
        ) : (
          <NoImagePlaceholder>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{ marginTop: '8px' }}>No image</span>
          </NoImagePlaceholder>
        )}
      </ThumbnailContainer>
      
      <InfoContainer>
        <BoardName>{board.board_name}</BoardName>
        <BoardStats>{board.pin_count || 0} pins</BoardStats>
      </InfoContainer>
    </CardContainer>
  );
};

export default BoardCard;