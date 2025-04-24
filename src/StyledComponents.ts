import styled from "styled-components";

export const Body = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SideBar = styled.div`
  flex: 0 0 300px;
  background: #f0f0f0;
  padding: 10px;
`;

export const SideBarItem = styled.div`
  border: 1px solid #000;
  border-radius: 3px;
  height: 30px;
  padding: 10px;
  margin: 10px 0;
  background: #fff;
`;

export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 50px;
`;

export const Page = styled.div`
  height: auto;
  flex: 1;
  padding: 30px;
`;

export const RowContainer = styled.div`
  border: 1px solid red;
  padding: 10px;
  margin: 10px 0;
`;

export const ColumnContainer = styled.div`
  border: 1px solid blue;
  flex: 1 1 100%;
  padding: 10px;
`;

export const ComponentContainer = styled.div`
  border: 1px solid green;
  padding: 10px;
  margin: 10px 0;
`;

export const Columns = styled.div`
  display: flex;
  padding: 10px 0;
`;

export const DropZoneContainer = styled.div`
  flex: 0 0 auto;
  height: 10px;
  transition: 0.2s;
  
  &.horizontalDrag {
    width: 10px;
    height: auto;
    margin: 0 5px;
  }

  &:not(.horizontalDrag).isLast {
    flex: 1 1 auto;
  }

  &.active {
    background: #00a2ff;
    height: 20px;
    
    &.horizontalDrag {
      width: 20px;
      height: auto;
    }
  }
`;

export const TrashDropZoneContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 100px;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    background: #f44336;
    color: white;
  }
`;

export const Base = styled.div`
  padding: 10px;
  background-color: white;
  cursor: move;
`;