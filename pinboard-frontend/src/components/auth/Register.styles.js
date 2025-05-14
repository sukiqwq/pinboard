import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background-color: var(--background-light);
`;

export const RegisterCard = styled.div`
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xl);
`;

export const Title = styled.h1`
  font-size: var(--font-size-xxl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  font-weight: 500;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

export const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-primary);
`;

export const Input = styled.input`
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

export const Button = styled.button`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-hover);
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

export const SuccessMessage = styled.div`
  color: green;
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--text-secondary);
`;

export const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;