import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import { createBoard } from '../../services/boardService';
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
} from './CreateBoard.styles';

const CreateBoard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    boardName: '',
    description: '',
    allowFriendsComment: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // 表单项更新处理 / Handle input and checkbox change
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.boardName.trim()) {
      setError('Please enter a board name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const boardData = {
        board_name: formData.boardName, // 确保字段名与后端一致 / Match backend field
        descriptor: formData.description,
        allow_friends_comment: formData.allowFriendsComment,
      };

      const response = await createBoard(boardData);
      console.log('Board created:', response.data);
      navigate(`/board/${response.data.board_id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
      setError(err.response?.data?.message || 'Failed to create board. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Create New Board</Title>

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
            placeholder="e.g. Food Ideas, Travel Plans..."
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
            placeholder="Describe the content of this board..."
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
              Allow friends to comment
            </Label>
          </CheckboxGroup>
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Board'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateBoard;
