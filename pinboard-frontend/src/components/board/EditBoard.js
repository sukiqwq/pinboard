import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBoards } from '../../context/BoardContext'; // Import useBoards hook
import { getBoard, updateBoard } from '../../services/boardService';
import Spinner from '../common/Spinner';
import {
  Container,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  CheckboxGroup,
  Checkbox,
  Button,
  ErrorMessage
} from './CreateBoard.styles'; // Reusing the same styles as CreateBoard

const EditBoard = () => {
  const { boardId } = useParams();
  const { currentUser } = useAuth();
  const { refreshBoards } = useBoards(); // Get refreshBoards function from context
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    boardName: '',
    description: '',
    allowFriendsComment: false
  });
  const [originalBoard, setOriginalBoard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
  const fetchBoard = async () => {
    try {
      setLoading(true);
      
      const response = await getBoard(boardId);
      const board = response.data;
      
      console.log('Board data:', board);
      console.log('Current user:', currentUser);
      
      // 修改后的权限检查 - 使用用户名比较或正确的 ID 属性
      const isOwner = currentUser && 
        (currentUser.username === board.owner.username || 
         currentUser.id === board.owner.id);
        
      if (!isOwner) {
        setError('You do not have permission to edit this board.');
        navigate(`/board/${boardId}`);
        return;
      }
      
      // 初始化表单数据
      setOriginalBoard(board);
      setFormData({
        boardName: board.board_name || '',
        description: board.descriptor || '',
        allowFriendsComment: board.allow_friends_comment || false
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch board:', err);
      setError('Failed to load board information. Please try again later.');
      setLoading(false);
    }
  };
  
  fetchBoard();
}, [boardId, currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.boardName.trim()) {
      setError('Please enter a board name.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const boardData = {
        board_name: formData.boardName,
        descriptor: formData.description,
        allow_friends_comment: formData.allowFriendsComment
      };
      
      await updateBoard(boardId, boardData);
      
      // Refresh boards list in context after successful update
      refreshBoards();
      
      navigate(`/board/${boardId}`);
    } catch (err) {
      console.error('Failed to update board:', err);
      setError(err.response?.data?.message || 'Failed to update board. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error && !originalBoard) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <Container>
      <Title>Edit Board</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="boardName">Board Name</Label>
          <Input
            type="text"
            id="boardName"
            name="boardName"
            value={formData.boardName}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description (Optional)</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="allowFriendsComment"
              name="allowFriendsComment"
              checked={formData.allowFriendsComment}
              onChange={handleChange}
            />
            <Label htmlFor="allowFriendsComment" style={{ marginBottom: 0 }}>
              Only allow friends to comment (restrict to friends)
            </Label>
          </CheckboxGroup>
        </FormGroup>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditBoard;