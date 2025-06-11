import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Paper,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Speed,
  Security,
  Support,
  Analytics,
  CheckCircle,
  TrendingUp,
  Groups,
  Assignment,
  Timer,
  ThumbUp,
  Headset,
  Dashboard,
  AutoGraph,
  SupportAgent,
  Rocket,
  Star,
  Language,
  Devices,
  CloudDone,
} from '@mui/icons-material';
import PublicLayout from '../../components/common/PublicLayout';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['pages', 'header', 'footer']);
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: t('landing.features.speed.title', { ns: 'pages', defaultValue: 'Жылдам шешім' }),
      description: t('landing.features.speed.description', { ns: 'pages', defaultValue: 'Орташа жауап беру уақыты 30 минуттан аз' }),
      color: '#2196f3',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: t('landing.features.security.title', { ns: 'pages', defaultValue: 'Қауіпсіздік' }),
      description: t('landing.features.security.description', { ns: 'pages', defaultValue: 'Деректерді шифрлау арқылы қорғалған жүйе' }),
      color: '#4caf50',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: t('landing.features.support24.title', { ns: 'pages', defaultValue: '24/7 қолдау' }),
      description: t('landing.features.support24.description', { ns: 'pages', defaultValue: 'Тәулік бойы техникалық қолдау көрсету' }),
      color: '#ff9800',
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: t('landing.features.analytics.title', { ns: 'pages', defaultValue: 'Аналитика' }),
      description: t('landing.features.analytics.description', { ns: 'pages', defaultValue: 'Толық статистика және есептер' }),
      color: '#9c27b0',
    },
  ];

  const stats = [
    { value: '50K+', label: t('landing.stats.resolvedTickets', { ns: 'pages', defaultValue: 'Шешілген өтініштер' }), icon: <CheckCircle /> },
    { value: '99%', label: t('landing.stats.satisfiedClients', { ns: 'pages', defaultValue: 'Қанағаттанған клиенттер' }), icon: <ThumbUp /> },
    { value: '<25мин', label: t('landing.stats.responseTime', { ns: 'pages', defaultValue: 'Жауап беру уақыты' }), icon: <Timer /> },
    { value: '24/7', label: t('landing.stats.support', { ns: 'pages', defaultValue: 'Қолдау көрсету' }), icon: <Headset /> },
  ];

  const benefits = [
    {
      icon: <Assignment />,
      title: t('landing.benefits.centralizedSystem.title', { ns: 'pages', defaultValue: 'Орталықтандырылған жүйе' }),
      description: t('landing.benefits.centralizedSystem.description', { ns: 'pages', defaultValue: 'Барлық өтініштерді бір жерде басқару' }),
    },
    {
      icon: <TrendingUp />,
      title: t('landing.benefits.progressTracking.title', { ns: 'pages', defaultValue: 'Прогресс бақылау' }),
      description: t('landing.benefits.progressTracking.description', { ns: 'pages', defaultValue: 'Нақты уақыттағы күй бақылау' }),
    },
    {
      icon: <Groups />,
      title: t('landing.benefits.teamwork.title', { ns: 'pages', defaultValue: 'Командалық жұмыс' }),
      description: t('landing.benefits.teamwork.description', { ns: 'pages', defaultValue: 'Тиімді ынтымақтастық және тапсырма бөлу' }),
    },
    {
      icon: <Dashboard />,
      title: t('landing.benefits.analytics.title', { ns: 'pages', defaultValue: 'Кеңейтілген аналитика' }),
      description: t('landing.benefits.analytics.description', { ns: 'pages', defaultValue: 'Толық статистика және өнімділік көрсеткіштері' }),
    },
    {
      icon: <Devices />,
      title: t('landing.benefits.multiplatform.title', { ns: 'pages', defaultValue: 'Кросс-платформа' }),
      description: t('landing.benefits.multiplatform.description', { ns: 'pages', defaultValue: 'Кез келген құрылғыдан қол жетімді' }),
    },
    {
      icon: <Language />,
      title: t('landing.benefits.multilingual.title', { ns: 'pages', defaultValue: 'Көптілді қолдау' }),
      description: t('landing.benefits.multilingual.description', { ns: 'pages', defaultValue: 'Қазақша, орысша және ағылшынша тілдері' }),
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: t('landing.process.steps.auth.title', { ns: 'pages', defaultValue: 'Авторизация' }),
      description: t('landing.process.steps.auth.description', { ns: 'pages', defaultValue: 'Жүйеге кіру немесе тіркелу' }),
      icon: <SupportAgent />,
    },
    {
      step: '02',
      title: t('landing.process.steps.create.title', { ns: 'pages', defaultValue: 'Өтінім жасау' }),
      description: t('landing.process.steps.create.description', { ns: 'pages', defaultValue: 'Мәселені толық сипаттау' }),
      icon: <Assignment />,
    },
    {
      step: '03',
      title: t('landing.process.steps.process.title', { ns: 'pages', defaultValue: 'Өңдеу' }),
      description: t('landing.process.steps.process.description', { ns: 'pages', defaultValue: 'Маманның жауап беруі' }),
      icon: <AutoGraph />,
    },
    {
      step: '04',
      title: t('landing.process.steps.solution.title', { ns: 'pages', defaultValue: 'Шешім' }),
      description: t('landing.process.steps.solution.description', { ns: 'pages', defaultValue: 'Мәселенің толық шешілуі' }),
      icon: <CheckCircle />,
    },
  ];

  const testimonials = [
    {
      name: t('landing.testimonials.testimonial1.name', { ns: 'pages', defaultValue: 'Айгүл Төлегенова' }),
      role: t('landing.testimonials.testimonial1.role', { ns: 'pages', defaultValue: 'IT директоры, Мемлекеттік ұйым' }),
      comment: t('landing.testimonials.testimonial1.comment', { ns: 'pages', defaultValue: 'Жүйе өте тиімді және пайдаланушыға ыңғайлы. Біздің IT қолдау сапасы айтарлықтай жақсарды.' }),
      rating: 5,
    },
    {
      name: t('landing.testimonials.testimonial2.name', { ns: 'pages', defaultValue: 'Ержан Қасымов' }),
      role: t('landing.testimonials.testimonial2.role', { ns: 'pages', defaultValue: 'Бас маман, Министрлік' }),
      comment: t('landing.testimonials.testimonial2.comment', { ns: 'pages', defaultValue: 'Жауап беру жылдамдығы керемет. Барлық өтініштер дер кезінде өңделеді.' }),
      rating: 5,
    },
    {
      name: t('landing.testimonials.testimonial3.name', { ns: 'pages', defaultValue: 'Мария Петрова' }),
      role: t('landing.testimonials.testimonial3.role', { ns: 'pages', defaultValue: 'Аналитик, Мемлекеттік қызмет' }),
      comment: t('landing.testimonials.testimonial3.comment', { ns: 'pages', defaultValue: 'Аналитика бөлімі керемет. Барлық қажет статистиканы оңай ала аламын.' }),
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          mt: -6, // Offset the default padding from PublicLayout
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 700,
                      mb: 3,
                      lineHeight: 1.2,
                    }}
                  >
                    {t('landing.hero.title', { ns: 'pages', defaultValue: 'Қазақстанның жаңа буын қолдау жүйесі' })}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      fontWeight: 300,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    {t('landing.hero.subtitle', { ns: 'pages', defaultValue: 'Мемлекеттік ұйымдарға арналған тиімді техникалық қолдау. Жылдам, сенімді, кәсіби.' })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                        transition: 'all 0.3s',
                      }}
                      startIcon={<Rocket />}
                    >
                      {t('landing.hero.loginButton', { ns: 'pages', defaultValue: 'Жүйеге кіру' })}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 400,
                      height: 400,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      zIndex: 0,
                    },
                  }}
                >
                  <img
                    src="/images/support-illustration.svg"
                    alt="Support System"
                    style={{
                      width: '100%',
                      height: 'auto',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Slide direction="up" in timeout={1000 + index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {t('landing.features.title', { ns: 'pages', defaultValue: 'Негізгі мүмкіндіктер' })}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('landing.features.subtitle', { ns: 'pages', defaultValue: 'Заманауи технологиялар мен тәжірибені біріктірген кешенді шешім' })}
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: 4,
                        borderColor: feature.color,
                      },
                    }}
                    elevation={0}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: `${feature.color}20`,
                          color: feature.color,
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Process Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {t('landing.process.title', { ns: 'pages', defaultValue: 'Жұмыс процесі' })}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('landing.process.subtitle', { ns: 'pages', defaultValue: 'Өтінімді өңдеудің қарапайым және тиімді процесі' })}
          </Typography>

          <Grid container spacing={4}>
            {processSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          bgcolor: 'primary.main',
                          fontSize: '2rem',
                          fontWeight: 700,
                        }}
                      >
                        {step.step}
                      </Avatar>
                      {index < processSteps.length - 1 && !isMobile && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '100%',
                            width: '100%',
                            height: 2,
                            bgcolor: 'primary.main',
                            opacity: 0.3,
                            transform: 'translateY(-50%)',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {t('landing.benefits.title', { ns: 'pages', defaultValue: 'Біздің артықшылықтар' })}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('landing.benefits.subtitle', { ns: 'pages', defaultValue: 'Неліктен бізді таңдау керек' })}
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Slide direction="up" in timeout={1000 + index * 100}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        mr: 2,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {benefit.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {t('landing.testimonials.title', { ns: 'pages', defaultValue: 'Клиенттердің пікірлері' })}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('landing.testimonials.subtitle', { ns: 'pages', defaultValue: 'Біздің клиенттеріміз не дейді' })}
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                        "{testimonial.comment}"
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <CloudDone sx={{ fontSize: 60, mb: 3 }} />
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {t('landing.cta.title', { ns: 'pages', defaultValue: 'Бүгін бастаңыз' })}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                {t('landing.cta.subtitle', { ns: 'pages', defaultValue: 'Техникалық қолдау сапасын жақсартуға дайынсыз ба?' })}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s',
                }}
                startIcon={<Rocket />}
              >
                {t('landing.cta.button', { ns: 'pages', defaultValue: 'Қазір бастау' })}
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;