import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/userService';
import {
  Container,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Button,
  ErrorMessage,
  SuccessMessage
} from './EditProfile.styles';

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