import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Box,
  Typography,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const StaffPerformanceTable = ({ data, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'error';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="250px" />} />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Card>
      <CardHeader 
        title="Производительность сотрудников"
        action={
          <Tooltip title="Статистика по назначенным и решенным заявкам">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Сотрудник</TableCell>
                {!isMobile && <TableCell align="center">Назначено</TableCell>}
                <TableCell align="center">Активные</TableCell>
                <TableCell align="center">Решено</TableCell>
                {!isMobile && <TableCell align="center">Ср. время</TableCell>}
                <TableCell align="center">Эффективность</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: isMobile ? 30 : 40, 
                          height: isMobile ? 30 : 40,
                          bgcolor: theme.palette.primary.main 
                        }}
                      >
                        {getInitials(staff.first_name, staff.last_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {staff.first_name} {staff.last_name}
                        </Typography>
                        {!isMobile && (
                          <Typography variant="caption" color="text.secondary">
                            {staff.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {staff.assigned_tickets || 0}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Chip 
                      label={staff.active_tickets || 0} 
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={staff.resolved_tickets || 0} 
                      size="small"
                      color="success"
                    />
                  </TableCell>
                  {!isMobile && (
                    <TableCell align="center">
                      <Typography variant="body2">
                        {staff.avg_resolution_time ? `${staff.avg_resolution_time}ч` : '-'}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Box sx={{ width: '100%', maxWidth: 100, mx: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={staff.resolution_rate || 0}
                            color={getPerformanceColor(staff.resolution_rate || 0)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {staff.resolution_rate || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: (isMobile ? 53 : 73) * emptyRows }}>
                  <TableCell colSpan={isMobile ? 4 : 6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
        />
      </CardContent>
    </Card>
  );
};

export default StaffPerformanceTable;