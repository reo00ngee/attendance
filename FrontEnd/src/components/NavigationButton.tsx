import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonProps extends Omit<ButtonProps, 'onClick'> {
  to: string;
  children: React.ReactNode;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ to, children, ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

export default NavigationButton;