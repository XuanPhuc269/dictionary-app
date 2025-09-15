import React, { useState, useEffect } from 'react';
import { 
  Container, 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Paper,
  Snackbar,
  Slide,
  Alert
} from '@mui/material';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchWordDefinition, setSearchWord } from './slice/dictionarySlice';
import { SelectionMenu } from './components/SelectionMenu';
import { createHighlight } from './services/highlightService';
import { addHighlight } from './slice/highlightSlice';
import { getAllHighlights, saveHighlight } from './services/api';
import DictionaryPopup from './components/DictionaryPopup';
import HighlightPanel from './components/HighlightPanel';
import EnglishTest from './components/EnglishTest';
import './App.css';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { word, data, status, error } = useAppSelector(state => state.dictionary);
  const { highlights } = useAppSelector(state => state.highlights);
  const [showDictionary, setShowDictionary] = useState(false);
  const [highlightNote, setHighlightNote] = useState('');
  const [currentHighlight, setCurrentHighlight] = useState<string>('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    type: 'success'
  });
  const [currentPosition, setCurrentPosition] = useState<{
    paragraphIndex: number;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  
  
  // Fetch highlights from the backend
  useEffect(() => {
    const fetchHighlightsFromServer = async () => {
      try {
        const savedHighlights = await getAllHighlights();
        savedHighlights.forEach(highlight => {
          dispatch(addHighlight(highlight));
        });
      } catch (error) {
        console.error('Failed to fetch highlights:', error);
      }
    };
    
    fetchHighlightsFromServer();
  }, [dispatch]);

  const handleLookup = (text: string) => {
    dispatch(setSearchWord(text));
    dispatch(fetchWordDefinition(text));
    setShowDictionary(true);
  };

  const handleHighlight = (
    text: string, 
    position?: {
      paragraphIndex: number;
      startOffset: number;
      endOffset: number;
    }
  ) => {
    setCurrentHighlight(text);
    setCurrentPosition(position || null);
    setShowNoteDialog(true);
  };

  const handleSaveHighlight = async () => {
    const highlight = createHighlight(
      currentHighlight, 
      '#ffeb3b', 
      currentPosition || undefined
    );
    
    if (highlightNote) {
      highlight.note = highlightNote;
    }
    
    try {
      const savedHighlight = await saveHighlight(highlight);
      dispatch(addHighlight(savedHighlight));
      setNotification({
        open: true,
        message: 'Highlight saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to save highlight:', error);
      dispatch(addHighlight(highlight));
      setNotification({
        open: true,
        message: 'Failed to save highlight to server',
        type: 'error'
      });
    }
    
    setShowNoteDialog(false);
    setHighlightNote('');
    setCurrentPosition(null);
  };
  
  const handleHighlightDeleted = () => {
    setNotification({
      open: true,
      message: 'Highlight deleted successfully',
      type: 'error'
    });
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
    }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#89CFF0', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" color="white">English Dictionary App</Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ 
        py: 3, 
        px: { xs: 2, md: 3 },
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          height: { xs: 'auto', md: 'calc(100vh - 120px)' },
          gap: 3,
          flexGrow: 1
        }}>
          {/* Left side - English Test */}
          <Box sx={{ 
            flex: { xs: '1 1 auto', md: '0 0 65%' },
            height: { xs: isMobile ? 'calc(50vh - 85px)' : 'auto', md: '100%' },
            mb: { xs: 2, md: 0 }
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <EnglishTest />
            </Paper>
          </Box>

          {/* Right side - Highlight Panel */}
          <Box sx={{ 
            flex: { xs: '1 1 auto', md: '0 0 35%' },
            height: { xs: isMobile ? 'calc(50vh - 85px)' : 'auto', md: '100%' }
          }}>
            <HighlightPanel 
              highlights={highlights} 
              onLookup={handleLookup}
              onDelete={handleHighlightDeleted}
            />
          </Box>
        </Box>
        
        <SelectionMenu 
          onLookup={handleLookup} 
          onHighlight={handleHighlight} 
        />

        {/* Dictionary Popup */}
        <DictionaryPopup
          open={showDictionary}
          onClose={() => setShowDictionary(false)}
          word={word}
          data={data}
          status={status}
          error={error}
        />

        {/* Highlight Note Dialog */}
        <Dialog 
          open={showNoteDialog} 
          onClose={() => setShowNoteDialog(false)}
          PaperProps={{
            sx: { 
              borderRadius: 2,
              width: { xs: '95%', sm: '450px' },
              maxWidth: '450px'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Add Note to Highlight</DialogTitle>
          <DialogContent>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box component="span" sx={{ color: 'text.secondary' }}>Selected text:</Box>{' '}
              <Box component="span" sx={{ fontWeight: 'medium' }}>{currentHighlight}</Box>
            </Typography>
            <TextField
              autoFocus
              label="Your Note"
              fullWidth
              multiline
              rows={3}
              value={highlightNote}
              onChange={(e) => setHighlightNote(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setShowNoteDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveHighlight} 
              variant="contained" 
              color="primary"
              sx={{ borderRadius: 1.5, ml: 1 }}
            >
              Save Highlight
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={2000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={(props) => <Slide {...props} direction="left" />}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
