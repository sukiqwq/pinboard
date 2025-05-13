import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoard, updateBoard } from '../../services/boardService';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #e60023;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    border-color: #e60023;
    outline: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Button = styled.button`
  background-color: #e60023;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ad081b;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e60023;
  margin-bottom: 1rem;
  text-align: center;
`;

const EditBoard = () => {
  const { boardId } = useParams();
  const { currentUser } = useAuth();
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
        
        // 检查是否为面板所有者
        if (currentUser && board.owner_user_id !== currentUser.user_id) {
          setError('您没有权限编辑此面板');
          navigate(`/board/${boardId}`);
          return;
        }
        
        setOriginalBoard(board);
        setFormData({
          boardName: board.board_name || '',
          description: board.descriptor || '',
          allowFriendsComment: board.allow_friends_comment || false
        });
        
        setLoading(false);
      } catch (err) {
        console.error('获取面板失败:', err);
        setError('获取面板信息失败，请稍后再试');
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
      setError('请输入面板名称');
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
      
      navigate(`/board/${boardId}`);
    } catch (err) {
      console.error('更新面板失败:', err);
      setError(err.response?.data?.message || '更新面板失败，请稍后再试');
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
      <Title>编辑面板</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="boardName">面板名称</Label>
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
          <Label htmlFor="description">描述 (可选)</Label>
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
              允许好友评论
            </Label>
          </CheckboxGroup>
        </FormGroup>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存更改'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditBoard;