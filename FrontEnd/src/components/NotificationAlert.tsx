import React from 'react';
import { Alert } from '@mui/material';
import Section from './Section';
import { useNotification } from '../hooks/useNotification';

interface NotificationAlertProps {
  notification: { type: string; message: string } | null;
  sx?: object;
}

const NotificationAlert: React.FC<NotificationAlertProps> = ({ 
  notification,
  sx = { mb: 2 }
}) => {
  if (!notification) return null;

  return (
    <Section>
      <Alert severity={notification.type as any} sx={sx}>
        {notification.message}
      </Alert>
    </Section>
  );
};

export default NotificationAlert;