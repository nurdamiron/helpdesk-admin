import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
  useMediaQuery,
  Skeleton,
  Typography
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useTranslation } from 'react-i18next';

const CategoryPieChart = ({ data, title, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation(['dashboard']);

  // Цвета для категорий
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7c7c',
    '#8dd1e1',
    '#d084d0'
  ];

  const TYPE_LABELS = {
    'complaint': t('types.complaint', 'Жалоба'),
    'suggestion': t('types.suggestion', 'Предложение'),
    'request': t('types.request', 'Запрос'),
    'other': t('types.other', 'Другое'),
    'support_request': t('types.support_request', 'Запрос поддержки'),
    'incident': t('types.incident', 'Инцидент'),
    'access_request': t('types.access_request', 'Запрос доступа'),
    'information_request': t('types.information_request', 'Запрос информации'),
    'emergency': t('types.emergency', 'Экстренный')
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="200px" />} />
        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="circular" width={250} height={250} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title={title || t('statistics.charts.ticketsByType', 'Заявки по типам')} />
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('statistics.noData')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Форматируем данные для отображения
  const formattedData = data.map(item => ({
    ...item,
    name: TYPE_LABELS[item.type] || TYPE_LABELS[item.category] || item.type || item.category || item.name,
    value: parseInt(item.count || item.value || 0),
    percentage: parseFloat(item.percentage || 0)
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Не показываем метки для маленьких секторов
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard:common.count')}: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard:common.percentage')}: {data.payload.percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%', height: isMobile ? 350 : 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={isMobile ? 80 : 100}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconSize={isMobile ? 12 : 18}
                wrapperStyle={{ fontSize: isMobile ? 11 : 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;