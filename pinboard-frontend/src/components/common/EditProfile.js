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
    // 如果用户未登录，则重定向到登录页
    // Redirect to login if user is not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // 初始化表单数据
    // Initialize form data with current user info
    setFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      profileInfo: currentUser.profile_info || ''
    });
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 更新表单数据
    // Update form data on input change
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
      
      // 提交更新请求
      // Send profile update request
      const response = await updateUserProfile(profileData);
      
      // 更新本地用户信息
      // Update local user info after successful update
      updateUser({
        ...currentUser,
        ...response.data
      });
      
      setSuccess('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again later.');
      setLoading(false);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Container>
      <Title>Edit Profile</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
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
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="profileInfo">Bio</Label>
          <TextArea
            id="profileInfo"
            name="profileInfo"
            value={formData.profileInfo}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfile;
