// src/components/tickets/TicketInfo.js
import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { 
  User, 
  Building, 
  Calendar, 
  FileText 
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { formatTicketCategory, formatPropertyType, formatKzPhoneNumber } from '../../utils/formatters';

const TicketInfo = ({ ticket, isMobile }) => {
  // Получаем информацию о клиенте и объекте из metadata
  const requesterInfo = ticket.requester || ticket.metadata?.requester || {};
  const propertyInfo = ticket.metadata?.property || {};

  // Казахстанские адреса для примеров, если адрес не указан
  const getDefaultAddress = () => {
    if (propertyInfo.address) return propertyInfo.address;
    
    switch (propertyInfo.type) {
      case 'apartment': 
        return 'г. Алматы, мкр. Самал-2, д. 33, кв. 42';
      case 'house': 
        return 'г. Нур-Султан, ул. Кунаева, д. 14';
      case 'office': 
        return 'г. Шымкент, пр. Республики, 50, БЦ "Казахстан", оф. 305';
      case 'commercial': 
        return 'г. Актобе, пр. Абилкайыр-хана, 85, ТЦ "Мега"';
      default:
        return 'Туркестанская обл., г. Туркестан, мкр. Отырар, 15';
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {ticket.subject}
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
        {ticket.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Информация о клиенте и объекте */}
      <Grid container spacing={2}>
        {/* Информация о клиенте */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ marginRight: '8px' }} />
                Информация о клиенте
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    ФИО:
                  </Typography>
                  <Typography variant="body2">
                    {requesterInfo.full_name || 'Не указано'}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {requesterInfo.email ? (
                      <a href={`mailto:${requesterInfo.email}`}>{requesterInfo.email}</a>
                    ) : (
                      'Не указан'
                    )}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    Телефон:
                  </Typography>
                  <Typography variant="body2">
                    {requesterInfo.phone ? (
                      <a href={`tel:${requesterInfo.phone}`}>{formatKzPhoneNumber(requesterInfo.phone)}</a>
                    ) : (
                      'Не указан'
                    )}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    Предпочт. способ связи:
                  </Typography>
                  <Typography variant="body2">
                    {requesterInfo.preferred_contact === 'phone' ? 'Телефон' : 
                     requesterInfo.preferred_contact === 'email' ? 'Email' : 
                     requesterInfo.preferred_contact === 'whatsapp' ? 'WhatsApp' : 
                     'Не указан'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Информация об объекте */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Building size={18} style={{ marginRight: '8px' }} />
                Информация об объекте
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    Тип объекта:
                  </Typography>
                  <Typography variant="body2">
                    {formatPropertyType(propertyInfo.type) || 'Не указан'}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    mb: 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                    Адрес:
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {getDefaultAddress() || 'Не указан'}
                  </Typography>
                </Box>
                
                {propertyInfo.area && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center' 
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: isMobile ? 'auto' : '100px' }}>
                      Площадь:
                    </Typography>
                    <Typography variant="body2">
                      {propertyInfo.area} м²
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Метаданные заявки */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <Calendar size={18} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                <strong>Создана:</strong> {formatDate(ticket.created_at, 'Asia/Almaty')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <Calendar size={18} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                <strong>Обновлена:</strong> {formatDate(ticket.updated_at, 'Asia/Almaty')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <FileText size={18} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                <strong>Категория:</strong> {formatTicketCategory(ticket.category)}
              </Typography>
            </Box>
          </Grid>
          
          {ticket.company_id && (
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <Building size={18} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  <strong>Компания:</strong> {ticket.company_name || `ID: ${ticket.company_id}`}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default TicketInfo;