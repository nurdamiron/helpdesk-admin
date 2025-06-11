import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TicketForm from '../../components/ticket/TicketForm';

const CreateTicketPage = () => {
  const { t } = useTranslation(['tickets', 'common']);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          {t('tickets:create.title', 'Создать заявку')}
        </Typography>
        
        <Paper sx={{ p: 4 }}>
          <TicketForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateTicketPage;