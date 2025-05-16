import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getUserFollowStreams, 
  createFollowStream, 
  updateFollowStream, 
  deleteFollowStream,
  getStreamBoards,
  removeBoardFromStream
} from '../../services/followService';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

// Styled components
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

const ActionButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.primary ? 'white' : 'var(--text-primary)'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-hover)' : 'var(--medium-gray)'};
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const StreamList = styled.div`
  margin-top: 1.5rem;
`;

const StreamItem = styled.div`
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const StreamHeader = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid var(--light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StreamName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const StreamNameInput = styled.input`
  font-size: 1.1rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  margin: 0;
  flex: 1;
  max-width: 300px;
`;

const StreamActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoardsContainer = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const BoardCard = styled(Link)`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const BoardName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BoardStats = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${BoardCard}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const CreateStreamForm = styled.form`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

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

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  border: 1px solid #4caf50;
  border-radius: var(--border-radius-md);
  color: #2e7d32;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: "✅";
    margin-right: var(--spacing-sm);
  }
`;

// Icon components
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const GalleryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const FollowStreamsPage = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedStreams, setExpandedStreams] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStreamName, setNewStreamName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // New state for editing stream names
  const [editingStreamId, setEditingStreamId] = useState(null);
  const [editedStreamName, setEditedStreamName] = useState('');

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUserFollowStreams();
      
      // 确保 response.data 存在且是数组
      const streamsData = Array.isArray(response.data) ? response.data : [];
      setStreams(streamsData);
      
      // Initialize expanded state for each stream
      const initialExpandedState = {};
      streamsData.forEach(stream => {
        initialExpandedState[stream.stream_id] = false;
      });
      setExpandedStreams(initialExpandedState);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch follow streams:', err);
      setError('Failed to load your follow streams. Please try again later.');
      setLoading(false);
    }
  };

  const toggleStreamExpanded = async (streamId) => {
    // Don't toggle if currently editing
    if (editingStreamId === streamId) {
      return;
    }
    
    const newExpandedState = {
      ...expandedStreams,
      [streamId]: !expandedStreams[streamId]
    };
    setExpandedStreams(newExpandedState);
    
    // If expanding and we don't have boards data yet, fetch them
    if (newExpandedState[streamId]) {
      try {
        const response = await getStreamBoards(streamId);
        // Update the stream object with boards data
        setStreams(prevStreams => 
          prevStreams.map(stream => 
            stream.stream_id === streamId 
              ? { ...stream, boards: response.data } 
              : stream
          )
        );
      } catch (err) {
        console.error(`Failed to fetch boards for stream ${streamId}:`, err);
      }
    }
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    
    if (!newStreamName.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      const response = await createFollowStream({ stream_name: newStreamName });
      
      // Add new stream to the list
      setStreams(prevStreams => [...prevStreams, response.data]);
      
      // Show success message
      setSuccessMessage('Stream created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setNewStreamName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create follow stream:', err);
      setError('Failed to create follow stream. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStream = async (streamId) => {
    if (!window.confirm('Are you sure you want to delete this stream? All boards in this stream will be unfollowed.')) {
      return;
    }
    
    try {
      setError('');
      await deleteFollowStream(streamId);
      
      // Remove the stream from the list
      setStreams(prevStreams => 
        prevStreams.filter(stream => stream.stream_id !== streamId)
      );
      
      // Show success message
      setSuccessMessage('Stream deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete stream:', err);
      setError('Failed to delete stream. Please try again.');
    }
  };

  const handleRemoveBoardFromStream = async (streamId, boardId) => {
    try {
      setError('');
      await removeBoardFromStream(streamId, boardId);
      
      // Update the stream's boards list
      setStreams(prevStreams => 
        prevStreams.map(stream => {
          if (stream.stream_id === streamId) {
            return {
              ...stream,
              boards: stream.boards.filter(board => board.board_id !== boardId)
            };
          }
          return stream;
        })
      );
    } catch (err) {
      console.error('Failed to remove board from stream:', err);
      setError('Failed to remove board from stream. Please try again.');
    }
  };
  
  // Handle edit button click
  const handleEditClick = (stream) => {
    setEditingStreamId(stream.stream_id);
    setEditedStreamName(stream.stream_name);
  };
  
  // Handle save edited stream name
  const handleSaveEdit = async (streamId) => {
    if (!editedStreamName.trim()) {
      return;
    }
    
    try {
      setError('');
      await updateFollowStream(streamId, { stream_name: editedStreamName });
      
      // Update stream in local state
      setStreams(prevStreams => 
        prevStreams.map(stream => 
          stream.stream_id === streamId 
            ? { ...stream, stream_name: editedStreamName } 
            : stream
        )
      );
      
      // Show success message
      setSuccessMessage('Stream name updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Exit edit mode
      setEditingStreamId(null);
    } catch (err) {
      console.error('Failed to update stream name:', err);
      setError('Failed to update stream name. Please try again.');
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingStreamId(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container>
      <Title>My Follow Streams</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <div style={{ textAlign: 'center' }}>
        <ActionButton 
          primary={!showCreateForm}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Stream'}
        </ActionButton>
      </div>
      
      {showCreateForm && (
        <CreateStreamForm onSubmit={handleCreateStream}>
          <FormGroup>
            <Label htmlFor="streamName">Stream Name</Label>
            <Input
              id="streamName"
              value={newStreamName}
              onChange={(e) => setNewStreamName(e.target.value)}
              placeholder="Enter a name for your new follow stream"
              required
            />
          </FormGroup>
          
          <ButtonGroup>
            <ActionButton 
              type="button" 
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </ActionButton>
            <ActionButton 
              type="submit" 
              primary 
              disabled={submitting || !newStreamName.trim()}
            >
              {submitting ? 'Creating...' : 'Create Stream'}
            </ActionButton>
          </ButtonGroup>
        </CreateStreamForm>
      )}
      
      <StreamList>
        {streams.length > 0 ? (
          streams.map(stream => (
            <StreamItem key={stream.stream_id}>
              <StreamHeader>
                {editingStreamId === stream.stream_id ? (
                  // Editing mode
                  <StreamNameInput
                    value={editedStreamName}
                    onChange={(e) => setEditedStreamName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  // Display mode
                  <StreamName onClick={() => toggleStreamExpanded(stream.stream_id)}>
                    {stream.stream_name}
                  </StreamName>
                )}
                
                <StreamActions>
                  {editingStreamId === stream.stream_id ? (
                    // Edit mode actions
                    <>
                      <ActionButton
                        onClick={() => handleSaveEdit(stream.stream_id)}
                        title="Save"
                      >
                        <SaveIcon />
                      </ActionButton>
                      <ActionButton
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        <CancelIcon />
                      </ActionButton>
                    </>
                  ) : (
                    // Normal mode actions
                    <>
                      <ActionButton
                        primary
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/follow-streams/${stream.stream_id}/pins`);
                        }}
                        title="View all pins"
                      >
                        <GalleryIcon />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleEditClick(stream)}
                        title="Edit name"
                      >
                        <EditIcon />
                      </ActionButton>
                      <ActionButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStream(stream.stream_id);
                        }}
                        title="Delete stream"
                      >
                        <TrashIcon />
                      </ActionButton>
                    </>
                  )}
                </StreamActions>
              </StreamHeader>
              
              {expandedStreams[stream.stream_id] && (
                <BoardsContainer>
                  {stream.boards && stream.boards.length > 0 ? (
                    stream.boards.map(board => (
                      <BoardCard key={board.board_id} to={`/board/${board.board_id}`}>
                        <BoardName>{board.board_name}</BoardName>
                        <BoardStats>{board.pins?.length || 0} pins</BoardStats>
                        <RemoveButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveBoardFromStream(stream.stream_id, board.board_id);
                          }}
                          title="Remove from stream"
                        >
                          &times;
                        </RemoveButton>
                      </BoardCard>
                    ))
                  ) : (
                    <EmptyMessage>No boards in this stream yet.</EmptyMessage>
                  )}
                </BoardsContainer>
              )}
            </StreamItem>
          ))
        ) : (
          <EmptyMessage>
            You don't have any follow streams yet. Create one to start following boards.
          </EmptyMessage>
        )}
      </StreamList>
    </Container>
  );
};

export default FollowStreamsPage;