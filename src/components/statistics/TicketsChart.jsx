import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const TicketsChart = ({ data, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartType, setChartType] = useState('area');

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const formatXAxis = (tickItem) => {
    try {
      return format(new Date(tickItem), 'MM/dd');
    } catch {
      return tickItem;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width="200px" />} />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  return (
    <Card>
      <CardHeader
        title="Динамика заявок"
        action={
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
          >
            <ToggleButton value="area">Область</ToggleButton>
            <ToggleButton value="line">Линии</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Box sx={{ width: '100%', height: isMobile ? 250 : 300 }}>
          <ResponsiveContainer>
            <ChartComponent
              data={data}
              margin={{
                top: 5,
                right: isMobile ? 5 : 30,
                left: isMobile ? -20 : 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="period" 
                tickFormatter={formatXAxis}
                style={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis style={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: isMobile ? 12 : 14 }}
                iconSize={isMobile ? 12 : 18}
              />
              <DataComponent
                type="monotone"
                dataKey="total"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.main}
                fillOpacity={0.3}
                strokeWidth={2}
                name="Всего заявок"
              />
              <DataComponent
                type="monotone"
                dataKey="resolved"
                stroke={theme.palette.success.main}
                fill={theme.palette.success.main}
                fillOpacity={0.3}
                strokeWidth={2}
                name="Решено"
              />
              <DataComponent
                type="monotone"
                dataKey="closed"
                stroke={theme.palette.info.main}
                fill={theme.palette.info.main}
                fillOpacity={0.3}
                strokeWidth={2}
                name="Закрыто"
              />
            </ChartComponent>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketsChart;