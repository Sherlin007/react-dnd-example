import styled from "styled-components";

export const DropZoneContainer = styled.div`
  flex: 0 0 auto;
  height: 48px;
  margin: 8px 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 16px);
    height: 2px;
    background: repeating-linear-gradient(
      to right,
      #d9d9d9 0,
      #d9d9d9 6px,
      transparent 6px,
      transparent 12px
    );
    opacity: 0;
    transition: all 0.2s ease;
  }
  
  &::after {
    content: '+ Drag any field here or click to add a new field';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 13px;
    color: #bfbfbf;
    background: #ffffff;
    padding: 0 12px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  &.active {
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
    border: 2px dashed #1890ff;
    height: 64px;
    
    &::before {
      opacity: 0;
    }
    
    &::after {
      content: 'Drop here to add field';
      color: #1890ff;
      font-weight: 500;
      opacity: 1;
    }
  }
  
  &.isEmpty {
    height: 80px;
    border: 2px dashed #e8e8e8;
    background: #fafafa;
    
    &::before {
      opacity: 0;
    }
    
    &::after {
      opacity: 1;
      color: #8c8c8c;
    }
    
    &:hover {
      border-color: #d9d9d9;
      background: #f5f5f5;
      
      &::after {
        color: #595959;
      }
    }
  }

  &.horizontalDrag {
    width: 48px;
    height: auto;
    min-height: 100px;
    margin: 0 8px;
    
    &::before {
      width: 2px;
      height: calc(100% - 16px);
      background: repeating-linear-gradient(
        to bottom,
        #d9d9d9 0,
        #d9d9d9 6px,
        transparent 6px,
        transparent 12px
      );
    }
    
    &::after {
      content: '+';
      font-size: 16px;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
  }

  &.isLast:not(.horizontalDrag) {
    flex: 1 1 auto;
    min-height: 48px;
  }
  
  &:hover:not(.active) {
    &::before {
      opacity: 0.6;
    }
    
    &::after {
      opacity: 0.8;
      color: #8c8c8c;
    }
  }
`;