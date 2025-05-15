import React, { createContext, useState, useContext, useEffect } from 'react';
import { getBoards } from '../services/boardService';
import { useAuth } from './AuthContext';

// Create context
const BoardContext = createContext();

// Create provider component
export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Function to fetch user's boards
  const fetchBoards = async () => {
    if (!currentUser) {
      setBoards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBoards();
      setBoards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      setLoading(false);
    }
  };

  // Fetch boards when user changes
  useEffect(() => {
    fetchBoards();
  }, [currentUser]);

  // Provide values
  const value = {
    boards,
    loading,
    refreshBoards: fetchBoards
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

// Create custom hook to use context
export const useBoards = () => {
  return useContext(BoardContext);
};