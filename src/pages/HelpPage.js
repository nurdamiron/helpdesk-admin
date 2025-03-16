// src/pages/HelpPage.js
import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  Grid,
  TextField,
  Link
} from '@mui/material';
import {
  HelpCircle,
  ChevronDown,
  FileText,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

const HelpPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1">
          Помощь
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Руководство пользователя и часто задаваемые вопросы
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Часто задаваемые вопросы
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>Как создать новую заявку?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Для создания новой заявки перейдите в раздел "Заявки" и нажмите кнопку "Создать заявку". 
                  Заполните все необходимые поля формы и нажмите "Сохранить". После этого заявка появится 
                  в общем списке заявок со статусом "Новая".
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>Как назначить ответственного за заявку?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Откройте детальную страницу заявки. В правой панели управления найдите поле "Ответственный". 
                  Выберите сотрудника из выпадающего списка и нажмите кнопку "Сохранить изменения" внизу панели.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>Как изменить статус заявки?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Откройте детальную страницу заявки. В правой панели управления найдите поле "Статус". 
                  Выберите нужный статус из выпадающего списка и нажмите кнопку "Сохранить изменения".
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>Как прикрепить файл к заявке?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Откройте детальную страницу заявки. Перейдите на вкладку "Файлы". Нажмите кнопку 
                  "Загрузить файл" и выберите файл на вашем компьютере. После загрузки файл появится 
                  в списке вложений заявки.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>Как добавить комментарий к заявке?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Откройте детальную страницу заявки. На вкладке "Обсуждение" вы увидите форму для отправки 
                  сообщений. Введите текст сообщения и нажмите кнопку "Отправить". Ваше сообщение появится 
                  в чате заявки и будет видно всем участникам.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Связаться с технической поддержкой
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              Если у вас возникли вопросы или проблемы при работе с системой, вы можете обратиться в нашу службу поддержки.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Тема обращения"
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание проблемы"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Mail />}
                  >
                    Отправить обращение
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FileText size={20} style={{ marginRight: 10 }} />
                <Typography variant="h6">Руководство пользователя</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Полное руководство по использованию системы Helpdesk для строительной компании.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<ExternalLink />}
                fullWidth
              >
                Открыть руководство
              </Button>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Video size={20} style={{ marginRight: 10 }} />
                <Typography variant="h6">Видео-инструкции</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Обучающие видео по работе с системой поддержки клиентов.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Link href="#" underline="none">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', marginRight: 8 }} />
                    <Typography variant="body2">Создание и обработка заявок</Typography>
                  </Box>
                </Link>
                <Link href="#" underline="none">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', marginRight: 8 }} />
                    <Typography variant="body2">Работа с клиентами</Typography>
                  </Box>
                </Link>
                <Link href="#" underline="none">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', marginRight: 8 }} />
                    <Typography variant="body2">Отчеты и аналитика</Typography>
                  </Box>
                </Link>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MessageCircle size={20} style={{ marginRight: 10 }} />
                <Typography variant="h6">Контакты поддержки</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Mail size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">support@helpdesk.ru</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">+7 (495) 123-45-67</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Время работы: Пн-Пт с 9:00 до 18:00
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HelpPage;