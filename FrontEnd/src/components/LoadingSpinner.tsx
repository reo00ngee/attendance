import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import Section from './Section';

interface LoadingSpinnerProps {
  loading: boolean;
  sx?: object;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  loading,
  sx = { display: "flex", justifyContent: "center", my: 4 }
}) => {
  if (!loading) return null;

  return (
    <Section>
      <Box sx={sx}>
        <CircularProgress />
      </Box>
    </Section>
  );
};

export default LoadingSpinner;