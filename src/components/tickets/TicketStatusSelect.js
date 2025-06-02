// src/components/tickets/TicketStatusSelect.js
import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  useTheme
} from '@mui/material';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Archive
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Обновленный список статусов в соответствии с базой данных
const TicketStatusSelect = ({ value, onChange }) => {
  const theme = useTheme();
  const { t } = useTranslation(['tickets', 'common']);

  // Статусы заявок, приведенные в соответствие с БД и UI
  const TICKET_STATUSES = [
    { value: 'new', label: t('tickets:status.new', 'Новая'), color: '#f44336', icon: <AlertCircle size={16} /> },
    { value: 'in_progress', label: t('tickets:status.in_progress', 'В работе'), color: '#2196f3', icon: <Clock size={16} /> },
    { value: 'waiting', label: t('tickets:status.pending', 'Ожидает'), color: '#ff9800', icon: <MoreHorizontal size={16} /> },
    { value: 'resolved', label: t('tickets:status.resolved', 'Решена'), color: '#4caf50', icon: <CheckCircle size={16} /> },
    { value: 'closed', label: t('tickets:status.closed', 'Закрыта'), color: '#9e9e9e', icon: <Archive size={16} /> }
  ];

  // Получение цвета для статуса
  const getStatusColor = (status) => {
    const statusItem = TICKET_STATUSES.find(item => item.value === status);
    return statusItem ? statusItem.color : '#9e9e9e';
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="ticket-status-label">{t('tickets:status.label', 'Мәртебе')}</InputLabel>
      <Select
        labelId="ticket-status-label"
        id="ticket-status"
        value={value || 'new'}
        onChange={(e) => onChange(e.target.value)}
        label={t('tickets:status.label', 'Мәртебе')}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: getStatusColor(value),
          },
        }}
      >
        {TICKET_STATUSES.map((status) => (
          <MenuItem 
            key={status.value} 
            value={status.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: status.color
            }}>
              {status.icon}
              <Box component="span" sx={{ ml: 1 }}>
                {status.label}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TicketStatusSelect;