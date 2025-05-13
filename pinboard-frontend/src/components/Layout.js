import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  margin: 20px 0;
  padding: 0 15px;
  max-width: 1200px;
  margin: 20px auto;
`;

const Layout = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <MainContainer>
      <Navbar user={currentUser} />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </MainContainer>
  );
};

export default Layout;