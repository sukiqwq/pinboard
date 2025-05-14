import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 假设您有一个 registerService 来处理注册逻辑
import { register as registerService } from '../../services/authService';
// useAuth 可能在注册后自动登录时使用，或者在注册后重定向到需要认证的页面前使用
// import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
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
  color: green;
  margin-bottom: 1rem;
  text-align: center;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // const { login } = useAuth(); // 如果注册后需要自动登录，则取消注释
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有必填项');
      setSuccess('');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // 调用注册服务
      // 假设 registerService 接受一个包含 username, email, password 的对象
      // 并且在成功时返回类似 { message: 'Registration successful' } 的响应
      // 如果您的API在注册后返回用户数据和token，您可以选择在这里自动登录
      const response = await registerService({ username, email, password });

      setSuccess(response.message || '注册成功！请前往登录。');
      // 清空表单
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // 可选：如果注册后自动登录
      // login(response.user, response.token);
      // navigate('/'); // 或者导航到其他页面

      // 如果注册后需要用户手动登录
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 延迟2秒后跳转到登录页面，让用户看到成功消息

    } catch (err) {
      setError(
        err.response?.data?.message || '注册失败，请稍后重试或检查您的输入'
      );
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>创建 Pinboard 账号</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="设置您的用户名"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入您的邮箱地址"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="设置您的密码"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入您的密码"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </Form>

        <LinkText>
          已有账号？ <Link to="/login">立即登录</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;