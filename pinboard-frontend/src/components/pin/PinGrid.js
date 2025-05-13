import React from 'react';
import Masonry from 'react-masonry-css';
import PinItem from './PinItem';
import styled from 'styled-components';

const StyledMasonry = styled(Masonry)`
  display: flex;
  width: auto;
  margin-left: -16px; /* gutter size offset */
`;

const MasonryColumn = styled.div`
  padding-left: 16px; /* gutter size */
  background-clip: padding-box;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
`;

const PinGrid = ({ pins, loading }) => {
  // 响应式断点设置
  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    992: 3,
    768: 2,
    576: 1
  };

  if (!pins || pins.length === 0) {
    return <NoResults>没有找到相关图钉</NoResults>;
  }

  return (
    <StyledMasonry
      breakpointCols={breakpointColumnsObj}
      className="pin-grid"
      columnClassName="pin-grid-column"
    >
      {pins.map(pin => (
        <PinItem key={pin.pin_id} pin={pin} />
      ))}
    </StyledMasonry>
  );
};

export default PinGrid;