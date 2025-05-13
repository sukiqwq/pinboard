import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/userService';
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

const SuccessMessage = styled.div`
  color: #4caf50;
  margin-bottom: 1rem;
  text-align: center;
`;

const EditProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileInfo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      profileInfo: currentUser.profile_info || ''
    });
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const profileData = {
        username: formData.username,
        email: formData.email,
        profile_info: formData.profileInfo
      };
      
      const response = await updateUserProfile(profileData);
      
      // 更新本地用户信息
      updateUser({
        ...currentUser,
        ...response.data
      });
      
      setSuccess('个人资料已成功更新！');
      setLoading(false);
    } catch (err) {
      console.error('更新个人资料失败:', err);
      setError(err.response?.data?.message || '更新个人资料失败，请稍后再试');
      setLoading(false);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Container>
      <Title>编辑个人资料</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">用户名</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">电子邮箱</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="profileInfo">个人简介</Label>
          <TextArea
            id="profileInfo"
            name="profileInfo"
            value={formData.profileInfo}
            onChange={handleChange}
            placeholder="介绍一下自己..."
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : '保存更改'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfile;