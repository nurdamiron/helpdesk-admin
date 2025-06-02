// src/components/tickets/TicketAssignSelect.js
import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Box, Avatar, CircularProgress, Typography } from '@mui/material';
import { User } from 'lucide-react';
import { authService } from '../../api/authService';

const TicketAssignSelect = ({ value, onChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await authService.getUsers();
        // Фильтруем только пользователей с ролью 'support' или 'admin'
        const supportUsers = data.filter(user => 
          user.role === 'support' || user.role === 'admin'
        );
        setUsers(supportUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Не удалось загрузить список сотрудников');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    return <Typography color="error" variant="caption">{error}</Typography>;
  }

  // Use actual users from the API
  const displayUsers = users;

  return (
    <FormControl fullWidth size="small">
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <User size={20} />
              <Box sx={{ ml: 1 }}>Не назначено</Box>
            </Box>;
          }
          
          const user = displayUsers.find(u => u.id === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user?.avatar ? (
                <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
              ) : (
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              )}
              <Box sx={{ ml: 1 }}>{user?.name || 'Неизвестный пользователь'}</Box>
            </Box>
          );
        }}
      >
        <MenuItem value="">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <User size={20} />
            <Box sx={{ ml: 1 }}>Не назначено</Box>
          </Box>
        </MenuItem>
        
        {displayUsers.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user.avatar ? (
                <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
              ) : (
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                  {user.name.charAt(0)}
                </Avatar>
              )}
              <Box sx={{ ml: 1 }}>{user.name}</Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TicketAssignSelect;