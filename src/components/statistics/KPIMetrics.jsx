import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Chip,
  useTheme,
  Skeleton,
  Rating,
  Stack
} from '@mui/material';
import {
  Speed as SpeedIcon,
  ThumbUp as ThumbUpIcon,
  Replay as ReplayIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'primary', progress = null }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            display: 'flex',
            mr: 2
          }}
        >
          <Icon />
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
      
      {progress !== null && (
        <Box sx={{ mt: 'auto' }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: `${color}.light`,
              '& .MuiLinearProgress-bar': {
                bgcolor: `${color}.main`
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
      )}
      
      {progress === null && subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

const KPIMetrics = ({ data, loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="200px" />} />
        <CardContent>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  const { sla, satisfaction, repeatTickets, hourlyLoad } = data || {};

  // Найдем час пик
  const peakHour = hourlyLoad?.reduce((max, current) => 
    current.ticket_count > max.ticket_count ? current : max
  , { hour: 0, ticket_count: 0 });

  return (
    <Card>
      <CardHeader 
        title="KPI Метрики"
        subheader="Ключевые показатели эффективности за последние 30 дней"
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* SLA Выполнение */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="SLA Выполнение"
              value={`${sla?.sla_percentage || 0}%`}
              subtitle={`${sla?.within_sla || 0} из ${sla?.total_resolved || 0} заявок`}
              icon={SpeedIcon}
              color="primary"
              progress={sla?.sla_percentage || 0}
            />
          </Grid>

          {/* Удовлетворенность */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'success.light',
                    color: 'success.main',
                    display: 'flex',
                    mr: 2
                  }}
                >
                  <ThumbUpIcon />
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Удовлетворенность
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
                  {satisfaction?.average_rating || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / 5
                </Typography>
              </Box>
              
              <Rating 
                value={satisfaction?.average_rating || 0} 
                readOnly 
                precision={0.1}
                size="small"
              />
              
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                {satisfaction?.total_ratings || 0} оценок
              </Typography>
            </Box>
          </Grid>

          {/* Повторные обращения */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Повторные обращения"
              value={repeatTickets?.repeat_tickets || 0}
              subtitle={`${repeatTickets?.users_with_multiple_tickets || 0} пользователей`}
              icon={ReplayIcon}
              color="warning"
            />
          </Grid>

          {/* Час пик */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Час пик"
              value={`${peakHour?.hour || 0}:00`}
              subtitle={`${peakHour?.ticket_count || 0} заявок`}
              icon={TrendingUpIcon}
              color="info"
            />
          </Grid>
        </Grid>

        {/* График загруженности по часам */}
        {hourlyLoad && hourlyLoad.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Загруженность по часам
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 100, gap: 0.5 }}>
              {Array.from({ length: 24 }, (_, i) => {
                const hourData = hourlyLoad.find(h => h.hour === i);
                const count = hourData?.ticket_count || 0;
                const maxCount = Math.max(...hourlyLoad.map(h => h.ticket_count));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: `${height}%`,
                      bgcolor: i === peakHour?.hour ? 'error.main' : 'primary.main',
                      opacity: 0.8,
                      borderRadius: '2px 2px 0 0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scaleY(1.05)'
                      }
                    }}
                    title={`${i}:00 - ${count} заявок`}
                  />
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">0:00</Typography>
              <Typography variant="caption" color="text.secondary">12:00</Typography>
              <Typography variant="caption" color="text.secondary">23:00</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KPIMetrics;