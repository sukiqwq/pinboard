import React, { useState, useEffect } from 'react';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../services/socialService';
import Spinner from '../common/Spinner';
import {
  Container,
  ContentWrapper,
  Title,
  Tabs,
  Tab,
  RequestList,
  RequestCard,
  Avatar,
  UserInfo,
  Username,
  RequestTime,
  Actions,
  ActionButton,
  EmptyState,
  EmptyMessage
} from './FriendRequests.styles';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFriendRequests();

        setReceivedRequests(response.data.received || []);
        setSentRequests(response.data.sent || []);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch friend requests:', err);
        setError('Failed to fetch friend requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);

      // Update the list, remove the accepted request
      setReceivedRequests(prevRequests =>
        prevRequests.filter(req => req.request_id !== requestId)
      );
    } catch (err) {
      console.error('Failed to accept friend request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);

      // Update the list, remove the rejected request
      setReceivedRequests(prevRequests =>
        prevRequests.filter(req => req.request_id !== requestId)
      );
    } catch (err) {
      console.error('Failed to reject friend request:', err);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>Friend Requests</Title>

        <Tabs>
          <Tab
            active={activeTab === 'received'}
            onClick={() => setActiveTab('received')}
          >
            Received ({receivedRequests.length})
          </Tab>
          <Tab
            active={activeTab === 'sent'}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({sentRequests.length})
          </Tab>
        </Tabs>

        {activeTab === 'received' && (
          <RequestList>
            {receivedRequests.length > 0 ? (
              receivedRequests.map(request => (
                <RequestCard key={request.request_id}>
                  <Avatar>{request.sender.username.charAt(0).toUpperCase()}</Avatar>
                  <UserInfo>
                    <Username to={`/user/${request.sender.username}`}>
                      {request.sender.username}
                    </Username>
                    <RequestTime>Request time: {formatDate(request.request_time)}</RequestTime>
                  </UserInfo>
                  <Actions>
                    <ActionButton
                      accept
                      onClick={() => handleAcceptRequest(request.request_id)}
                    >
                      Accept
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleRejectRequest(request.request_id)}
                    >
                      Decline
                    </ActionButton>
                  </Actions>
                </RequestCard>
              ))
            ) : (
              <EmptyState>
                <EmptyMessage>You haven't received any friend requests.</EmptyMessage>
              </EmptyState>
            )}
          </RequestList>
        )}

        {activeTab === 'sent' && (
          <RequestList>
            {sentRequests.length > 0 ? (
              sentRequests.map(request => (
                <RequestCard key={request.request_id}>
                  <Avatar>{request.receiver.username.charAt(0).toUpperCase()}</Avatar>
                  <UserInfo>
                    <Username to={`/user/${request.receiver.username}`}>
                      {request.receiver.username}
                    </Username>
                    <RequestTime>
                      Sent time: {formatDate(request.request_time)}
                      <br />
                      Status: {
                        request.status === 'pending' ? 'Awaiting response' :
                          request.status === 'accepted' ? 'Accepted' :
                            request.status === 'rejected' ? 'Declined' :
                              request.status
                      }
                    </RequestTime>
                  </UserInfo>
                </RequestCard>
              ))
            ) : (
              <EmptyState>
                <EmptyMessage>You haven't sent any friend requests.</EmptyMessage>
              </EmptyState>
            )}
          </RequestList>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default FriendRequests;