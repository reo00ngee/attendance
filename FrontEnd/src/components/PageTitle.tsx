import React from 'react';
import { Typography } from '@mui/material';
import Section from './Section';

interface PageTitleProps {
  title: string;
  sx?: object;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title,
  sx = { mb: 0.5 }
}) => {
  return (
    <Section>
      <Typography variant="h4" align="left" sx={sx}>
        {title}
      </Typography>
    </Section>
  );
};

export default PageTitle;