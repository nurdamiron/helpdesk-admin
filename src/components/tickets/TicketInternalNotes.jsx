// src/components/tickets/TicketInternalNotes.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { Send, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ticketService } from '../../api/ticketService';
import { formatDate } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';

const TicketInternalNotes = ({ ticketId, notes = [] }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localNotes, setLocalNotes] = useState(notes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const noteData = {
        content: newNote.trim(),
        ticketId: ticketId,
      };
      
      const response = await ticketService.addInternalNote(ticketId, noteData);
      
      // Добавляем новую заметку в список
      setLocalNotes([...localNotes, response]);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      setError(t('tickets:internalNotes.addError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper 
        variant="outlined" 
        sx={{ 
          height: '300px', 
          overflowY: 'auto',
          mb: 2
        }}
      >
        {localNotes.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={2}
          >
            <MessageSquare size={40} color="#9e9e9e" />
            <Typography color="textSecondary" align="center" sx={{ mt: 1 }}>
              {t('tickets:internalNotes.noNotes')}
              <br />
              {t('tickets:internalNotes.addNoteHint')}
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', padding: 0 }}>
            {localNotes.map((note, index) => (
              <React.Fragment key={note.id}>
                <ListItem alignItems="flex-start" sx={{ px: 2, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={note.user?.avatar}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {note.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          {note.user?.name || t('tickets:internalNotes.unknownUser')}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(note.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        sx={{ display: 'inline', whiteSpace: 'pre-wrap' }}
                      >
                        {note.content}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < localNotes.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('tickets:internalNotes.placeholder')}
          multiline
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={submitting}
          sx={{ mb: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitting || !newNote.trim()}
          startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
        >
          {submitting ? t('tickets:internalNotes.submitting') : t('tickets:internalNotes.addNote')}
        </Button>
      </form>
    </Box>
  );
};

export default TicketInternalNotes;