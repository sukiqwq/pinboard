import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Create Board button special styling
const CreateBoardContainer = styled(Link)`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CreateBoardContent = styled.div`
  text-align: center;
  
  svg {
    margin-bottom: 0.5rem;
  }
  
  div {
    margin-top: 0.5rem;
    color: #666;
  }
`;

// Create Board Button component
const CreateBoardButton = ({ to = "/board/create" }) => (
  <CreateBoardContainer to={to}>
    <CreateBoardContent>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#666" />
      </svg>
      <div>Create Board</div>
    </CreateBoardContent>
  </CreateBoardContainer>
);

export default CreateBoardButton;