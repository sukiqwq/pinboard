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
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPins = async () => {
    try {
      setFetchingMore(true);
      const response = await getPins(page);
      const newPins = response.data;

      if (newPins.length === 0) {
        setHasMore(false);
      } else {
        setPins(prevPins => [...prevPins, ...newPins]);
        setPage(prevPage => prevPage + 1);
      }

      setLoading(false);
      setFetchingMore(false);
    } catch (err) {
      console.error('Failed to fetch pins:', err);
      setError('Failed to fetch pins. Please try again later.');
      setLoading(false);
      setFetchingMore(false);
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
        loader={fetchingMore && <LoadingMessage>Loading more pins...</LoadingMessage>}
        endMessage={
          <EndMessage>
            {pins.length > 0
              ? "You've reached the end! No more pins available."
              : 'No pins available yet. Be the first to share one!'}
          </EndMessage>
        }
      >
        <PinGrid pins={pins} />
      </InfiniteScroll>
    </HomeContainer>
  );
};

export default HomePage;