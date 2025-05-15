import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PinGrid from './pin/PinGrid';
import Spinner from './common/Spinner';
import { getPins } from '../services/pinService';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-weight: 500;
`;

const HomePage = () => {
  const [pins, setPins] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchPins = async () => {
    try {
      const response = await getPins(page);
      const newPins = response.data;

      if (newPins.length === 0) {
        setHasMore(false);
      } else {
        setPins(prevPins => [...prevPins, ...newPins]);
        setPage(prevPage => prevPage + 1);
      }

      setLoading(false);
    } catch (err) {
      console.error('获取图钉失败:', err);
      setError('获取图钉失败，请稍后再试');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  if (loading && pins.length === 0) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <HomeContainer>
      <InfiniteScroll
        dataLength={pins.length}
        next={fetchPins}
        hasMore={hasMore}
        loader={<LoadingMessage>加载更多图钉...</LoadingMessage>}
        endMessage={
          <EndMessage>
            {pins.length > 0
              ? '已经到底啦！没有更多图钉了~'
              : '暂时还没有图钉，快来分享第一个吧！'}
          </EndMessage>
        }
      >
        <PinGrid pins={pins} />
      </InfiniteScroll>
    </HomeContainer>
  );
};

export default HomePage;