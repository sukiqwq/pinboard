import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../services/socialService';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#e60023' : 'transparent'};
  color: ${props => props.active ? '#e60023' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e60023;
  }
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: #333;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RequestTime = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.accept ? '#e60023' : '#f0f0f0'};
  color: ${props => props.accept ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.accept ? '#ad081b' : '#ddd'};
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const EmptyMessage = styled.p`
  color: #666;
  margin-bottom: 0;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const FriendRequests = () => {
  // const { currentUser } = useAuth();

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
        console.error('获取好友请求失败:', err);
        setError('获取好友请求失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);

      // 更新列表，移除已接受的请求
      setReceivedRequests(prevRequests =>
        prevRequests.filter(req => req.request_id !== requestId)
      );
    } catch (err) {
      console.error('接受好友请求失败:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);

      // 更新列表，移除已拒绝的请求
      setReceivedRequests(prevRequests =>
        prevRequests.filter(req => req.request_id !== requestId)
      );
    } catch (err) {
      console.error('拒绝好友请求失败:', err);
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
      <Title>好友请求</Title>

      <Tabs>
        <Tab
          active={activeTab === 'received'}
          onClick={() => setActiveTab('received')}
        >
          收到的请求 ({receivedRequests.length})
        </Tab>
        <Tab
          active={activeTab === 'sent'}
          onClick={() => setActiveTab('sent')}
        >
          发出的请求 ({sentRequests.length})
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
                  <RequestTime>请求时间: {formatDate(request.request_time)}</RequestTime>
                </UserInfo>
                <Actions>
                  <ActionButton
                    accept
                    onClick={() => handleAcceptRequest(request.request_id)}
                  >
                    接受
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleRejectRequest(request.request_id)}
                  >
                    拒绝
                  </ActionButton>
                </Actions>
              </RequestCard>
            ))
          ) : (
            <EmptyState>
              <EmptyMessage>您没有收到任何好友请求。</EmptyMessage>
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
                    发送时间: {formatDate(request.request_time)}
                    <br />
                    状态: {
                      request.status === 'pending' ? '等待回应' :
                        request.status === 'accepted' ? '已接受' :
                          request.status === 'rejected' ? '已拒绝' :
                            request.status
                    }
                  </RequestTime>
                </UserInfo>
              </RequestCard>
            ))
          ) : (
            <EmptyState>
              <EmptyMessage>您没有发送任何好友请求。</EmptyMessage>
            </EmptyState>
          )}
        </RequestList>
      )}
    </Container>
  );
};

export default FriendRequests;