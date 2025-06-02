import React from 'react';
import { Fade } from '@mui/material';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для плавных переходов между страницами
 * Оборачивает содержимое страницы и добавляет анимацию перехода
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @param {string} props.transitionKey - Ключ для определения изменения содержимого (обычно URL)
 * @returns {React.ReactElement} Компонент с анимацией
 */
const PageTransition = ({ children, transitionKey }) => {
  const location = useLocation();
  const key = transitionKey || location.pathname;

  return (
    <Fade
      key={key}
      in={true}
      timeout={{ enter: 500, exit: 300 }}
      mountOnEnter
      unmountOnExit
    >
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </Fade>
  );
};

export default PageTransition; 