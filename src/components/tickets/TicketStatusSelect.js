// src/components/tickets/TicketStatusSelect.js
import React from 'react';
import { FormControl, Select, MenuItem, Box } from '@mui/material';
import { Clock, AlertCircle, CheckCircle, Archive } from 'lucide-react';

const statuses = [
  { value: 'new', label: 'Новая', icon: <AlertCircle size={20} color="#f44336" /> },
  { value: 'in_progress', label: 'В работе', icon: <Clock size={20} color="#2196f3" /> },
  { value: 'pending', label: 'Ожидает ответа', icon: <Clock size={20} color="#ff9800" /> },
  { value: 'resolved', label: 'Решена', icon: <CheckCircle size={20} color="#4caf50" /> },
  { value: 'closed', label: 'Закрыта', icon: <Archive size={20} color="#9e9e9e" /> },
];

const TicketStatusSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => {
          const status = statuses.find(s => s.value === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {status?.icon}
              <Box sx={{ ml: 1 }}>{status?.label}</Box>
            </Box>
          );
        }}
      >
        {statuses.map((status) => (
          <MenuItem key={status.value} value={status.value}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {status.icon}
              <Box sx={{ ml: 1 }}>{status.label}</Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TicketStatusSelect;