import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFollowStream, getStreamPins } from '../../services/followService';
import PinGrid from '../pin/PinGrid';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StreamInfo = styled.div`
  flex: 1;
`;

const StreamName = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const BoardCount = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const BackButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PinsContainer = styled.div`
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const EmptyStateMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.p`
  color: #e60023;
  margin-bottom: 1.5rem;
`;

const StreamPinsPage = () => {
  const { streamId } = useParams();
  const navigate = useNavigate();
  
  const [stream, setStream] = useState(null);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stream details
        const streamResponse = await getFollowStream(streamId);
        setStream(streamResponse.data);
        
        // Fetch all pins from stream
        const pinsResponse = await getStreamPins(streamId);
        setPins(pinsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stream data:', err);
        setError('Failed to load stream data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [streamId]);
  
  const handleBackClick = () => {
    navigate('/follow-streams');
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={handleBackClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Streams
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <StreamInfo>
          <StreamName>{stream?.stream_name || 'Stream'}</StreamName>
          <BoardCount>
            {stream?.boards?.length || 0} boards • {pins.length} pins
          </BoardCount>
        </StreamInfo>
        
        <BackButton onClick={handleBackClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Streams
        </BackButton>
      </Header>
      
      <PinsContainer>
        {pins.length > 0 ? (
          <PinGrid pins={pins} />
        ) : (
          <EmptyState>
            <EmptyStateTitle>No pins in this stream</EmptyStateTitle>
            <EmptyStateMessage>
              This stream doesn't have any pins yet. Add boards to this stream to see pins here.
            </EmptyStateMessage>
            <BackButton onClick={handleBackClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Streams
            </BackButton>
          </EmptyState>
        )}
      </PinsContainer>
    </Container>
  );
};

export default StreamPinsPage;