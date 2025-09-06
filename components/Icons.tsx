
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    {children}
  </svg>
);

export const SelectIcon = () => (
  <IconWrapper>
    <path d="M6 6H7V18H6V6Z" fill="black" />
    <path d="M7 6H16V7H7V6Z" fill="black" />
    <path d="M16 7H17V9H16V7Z" fill="black" />
    <path d="M15 9H16V10H15V9Z" fill="black" />
    <path d="M14 10H15V11H14V10Z" fill="black" />
    <path d="M13 11H14V12H13V11Z" fill="black" />
    <path d="M12 12H13V13H12V12Z" fill="black" />
    <path d="M11 13H12V14H11V13Z" fill="black" />
    <path d="M10 14H11V15H10V14Z" fill="black" />
    <path d="M9 15H10V16H9V15Z" fill="black" />
    <path d="M8 16H9V17H8V16Z" fill="black" />
    <path d="M7 17H8V18H7V17Z" fill="black" />
  </IconWrapper>
);

export const HighlightIcon = () => (
  <IconWrapper>
    <path fillRule="evenodd" clipRule="evenodd" d="M10 5H14V7H18V11H16V18H8V11H6V7H10V5ZM14 11H10V16H14V11Z" fill="#808080"/>
    <path d="M9 6H15V8H17V12H15V17H9V12H7V8H9V6Z" fill="yellow"/>
  </IconWrapper>
);

export const DrawIcon = () => (
  <IconWrapper>
    <path d="M16 6L18 8L10 16H8V14L16 6Z" fill="black" />
    <path d="M7 15H10V17H7V15Z" fill="#808080" />
  </IconWrapper>
);

export const EraseIcon = () => (
  <IconWrapper>
    <path d="M7 7H17V17H7V7Z" fill="#C0C0C0" />
    <path d="M6 8H7V16H6V8Z" fill="#808080" />
    <path d="M17 8H18V16H17V8Z" fill="#808080" />
    <path d="M8 6H16V7H8V6Z" fill="#808080" />
    <path d="M8 17H16V18H8V17Z" fill="#808080" />
    <path d="M8 8H16V16H8V8Z" fill="white" />
  </IconWrapper>
);

export const EyedropperIcon = () => (
    <IconWrapper>
        <path d="M14 6L18 10L16 12L12 8L14 6Z" fill="black" />
        <path d="M11 9L7 13V17H11L15 13L11 9Z" fill="#808080"/>
        <path d="M12 10L14 12L10 16H8V14L12 10Z" fill="white"/>
    </IconWrapper>
);

export const ZoomIcon = () => (
    <IconWrapper>
        <path d="M10 6H14V7H10V6Z" fill="black" />
        <path d="M9 7H10V8H9V7Z" fill="black" />
        <path d="M14 7H15V8H14V7Z" fill="black" />
        <path d="M8 8H9V12H8V8Z" fill="black" />
        <path d="M15 8H16V12H15V8Z" fill="black" />
        <path d="M9 12H10V13H9V12Z" fill="black" />
        <path d="M14 12H15V13H14V12Z" fill="black" />
        <path d="M10 13H14V14H10V13Z" fill="black" />
        <path d="M14 14L18 18" stroke="black" strokeWidth="1" />
        <path d="M11 9H13V10H11V9Z" fill="black" />
        <path d="M11 11H13V12H11V11Z" fill="black" />
        <path d="M10 10H11V11H10V10Z" fill="black" />
        <path d="M13 10H14V11H13V10Z" fill="black" />
    </IconWrapper>
);

export const RotateLeftIcon = () => (
    <IconWrapper>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18V16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8H15V11L19 7L15 3V6H12Z" fill="black" />
    </IconWrapper>
);

export const RotateRightIcon = () => (
    <IconWrapper>
        <path d="M12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18V16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8H9V11L5 7L9 3V6H12Z" fill="black" />
    </IconWrapper>
);

export const ChatIcon = () => (
    <IconWrapper>
        <path d="M5 5H19V15H13L11 17V15H5V5Z" fill="white" stroke="black" strokeWidth="1" />
        <path d="M7 8H17V9H7V8Z" fill="black" />
        <path d="M7 11H14V12H7V11Z" fill="black" />
    </IconWrapper>
);
