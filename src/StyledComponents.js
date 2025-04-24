import styled from 'styled-components';

// Global styles
export const GlobalStyle = styled.createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

// Layout components
export const Body = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SideBar = styled.div`
  flex: 0 0 1;
  width: 200px;
  padding: 10px;
  border-right: 1px solid #111;
  height: 100vh;
  background: #e1e1e1;
`;

export const SideBarItem = styled.div`
  border: 1px solid #000;
  border-radius: 3px;
  height: 30px;
  padding: 10px;
  margin-top: 10px;
  background: #ccc;
`;

export const Page = styled.div`
  flex: 1 1 auto;
  padding: 0 20px;
  margin: 20px;
  border: 1px solid green;
`;

export const DropZoneContainer = styled.div`
  flex: 0 0 auto;
  height: 40px;
  transition: 200ms all;

  &:nth-of-type(2n) {
    display: none;
  }

  &.horizontalDrag {
    width: 40px;
    height: auto;
  }

  &:not(.horizontalDrag).isLast {
    flex: 1 1 auto;
  }

  &.active {
    background: #00a2ff;
    transition: 100ms all;
  }
`;

export const ComponentContainer = styled.div`
  height: 60px;
  padding: 10px;
  background: #aaa;
`;

export const ColumnContainer = styled.div`
  border: 1px solid blue;
  flex: 1 1 100%;
  padding: 10px;
`;

export const Columns = styled.div`
  display: flex;
  padding: 20px 0;
`;

export const ColumnWrapper = styled.div`
  display: flex;
`;

export const Base = styled.div`
  padding: 0.5rem 1rem;
  background-color: white;
  cursor: move;
`;

export const RowContainer = styled.div`
  border: 1px solid red;
  padding: 0;
`;

export const TrashDropZoneContainer = styled.div`
  position: relative;
  text-align: center;
  padding: 20px 0;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border: 1px solid purple;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    background: #00a2ff;
    transition: 100ms all;
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 100px;
`;