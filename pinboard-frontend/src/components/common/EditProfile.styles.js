import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xxl);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
`;

export const Title = styled.h1`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  text-align: center;
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
`;

export const Input = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--light-gray);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  resize: vertical;
  min-height: 100px;
  
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
  padding: var(--spacing-sm) var(--spacing-md);
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
  color: #4caf50; /* Adding a success color to variables.css */
  margin-bottom: var(--spacing-md);
  text-align: center;
`;