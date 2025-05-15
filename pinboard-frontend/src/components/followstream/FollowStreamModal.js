import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  getUserFollowStreams, 
  createFollowStream, 
  addBoardToStream 
} from '../../services/followService';

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  width: 90%;
  max-width: 500px;
  padding: var(--spacing-lg);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ModalTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: var(--spacing-md);
`;

const Tab = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const StreamList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: var(--spacing-md);
`;

const StreamItem = styled.div`
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: var(--light-gray);
  }
  
  &.selected {
    background-color: var(--light-gray);
  }
`;

const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-right: var(--spacing-sm);
`;

const StreamName = styled.span`
  flex-grow: 1;
`;

const Form = styled.form`
  margin-top: var(--spacing-md);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-sm);
  border: 2px solid var(--light-gray);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const Button = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.primary ? 'white' : 'var(--text-primary)'};
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-hover)' : 'var(--medium-gray)'};
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

// 更新后的错误消息样式，与整体UI更加协调
const ErrorMessage = styled.div`
  background-color: #ffebe9;
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  color: var(--primary-color);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: "⚠️";
    margin-right: var(--spacing-sm);
  }
`;

const NoStreamsMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--text-secondary);
`;

const FollowStreamModal = ({ isOpen, onClose, boardId, onFollowSuccess }) => {
  const [activeTab, setActiveTab] = useState('existing');
  const [streams, setStreams] = useState([]);
  const [selectedStreamId, setSelectedStreamId] = useState(null);
  const [newStreamName, setNewStreamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user's follow streams
  useEffect(() => {
    const fetchStreams = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        const response = await getUserFollowStreams();
        setStreams(response.data);
        
        // If there are streams, select the first one by default
        if (response.data.length > 0) {
          setSelectedStreamId(response.data[0].stream_id);
        } else {
          // If no streams, switch to the create tab
          setActiveTab('create');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch follow streams:', err);
        setError('Failed to load your follow streams. Please try again.');
        setLoading(false);
      }
    };
    
    fetchStreams();
  }, [isOpen]);

  const handleSelectStream = (streamId) => {
    setSelectedStreamId(streamId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleAddToExistingStream = async () => {
    if (!selectedStreamId) {
      setError('Please select a stream');
      return;
    }
    
    try {
      setLoading(true);
      await addBoardToStream(selectedStreamId, boardId);
      onFollowSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to add board to stream:', err);
      setError('Failed to add board to stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    
    if (!newStreamName.trim()) {
      setError('Please enter a stream name');
      return;
    }
    
    try {
      setLoading(true);
      // Create new stream
      const response = await createFollowStream({ stream_name: newStreamName });
      const newStreamId = response.data.stream_id;
      
      // Add board to the new stream
      await addBoardToStream(newStreamId, boardId);
      
      onFollowSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create follow stream:', err);
      setError('Failed to create follow stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Follow Board</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'existing'} 
            onClick={() => handleTabChange('existing')}
            disabled={streams.length === 0}
          >
            Existing Stream
          </Tab>
          <Tab 
            active={activeTab === 'create'} 
            onClick={() => handleTabChange('create')}
          >
            Create New Stream
          </Tab>
        </TabContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {activeTab === 'existing' && (
          <>
            {streams.length > 0 ? (
              <StreamList>
                {streams.map(stream => (
                  <StreamItem 
                    key={stream.stream_id} 
                    className={selectedStreamId === stream.stream_id ? 'selected' : ''}
                    onClick={() => handleSelectStream(stream.stream_id)}
                  >
                    <RadioButton 
                      checked={selectedStreamId === stream.stream_id}
                      onChange={() => handleSelectStream(stream.stream_id)}
                      name="streamSelection"
                    />
                    <StreamName>{stream.stream_name}</StreamName>
                  </StreamItem>
                ))}
              </StreamList>
            ) : (
              <NoStreamsMessage>
                You don't have any follow streams yet. Create a new one to follow this board.
              </NoStreamsMessage>
            )}
            
            <ButtonGroup>
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                primary 
                onClick={handleAddToExistingStream}
                disabled={!selectedStreamId || loading}
              >
                {loading ? 'Adding...' : 'Add to Stream'}
              </Button>
            </ButtonGroup>
          </>
        )}
        
        {activeTab === 'create' && (
          <Form onSubmit={handleCreateStream}>
            <FormGroup>
              <Label htmlFor="streamName">Stream Name</Label>
              <Input
                id="streamName"
                placeholder="Enter a name for your new follow stream"
                value={newStreamName}
                onChange={e => setNewStreamName(e.target.value)}
                required
              />
            </FormGroup>
            
            <ButtonGroup>
              <Button type="button" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit" 
                primary
                disabled={!newStreamName.trim() || loading}
              >
                {loading ? 'Creating...' : 'Create & Follow'}
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default FollowStreamModal;