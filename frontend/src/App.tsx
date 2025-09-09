import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchWordDefinition, setSearchWord } from './slice/dictionarySlice';
import { SelectionMenu } from './components/SelectionMenu';
import { createHighlight } from './services/highlightService';
import { addHighlight } from './slice/highlightSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { word, data, status, error } = useAppSelector(state => state.dictionary);
  const { highlights } = useAppSelector(state => state.highlights);
  const [showDictionary, setShowDictionary] = useState(false);
  const [highlightNote, setHighlightNote] = useState('');
  const [currentHighlight, setCurrentHighlight] = useState<string>('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchWord(e.target.value));
  };

  const handleSearch = () => {
    if (word.trim()) {
      dispatch(fetchWordDefinition(word));
      setShowDictionary(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLookup = (text: string) => {
    dispatch(setSearchWord(text));
    dispatch(fetchWordDefinition(text));
    setShowDictionary(true);
  };

  const handleHighlight = (text: string) => {
    setCurrentHighlight(text);
    setShowNoteDialog(true);
  };

  const handleSaveHighlight = () => {
    const highlight = createHighlight(currentHighlight);
    if (highlightNote) {
      highlight.note = highlightNote;
    }
    dispatch(addHighlight(highlight));
    setShowNoteDialog(false);
    setHighlightNote('');
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">English Dictionary App</Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>

          {/* Quiz content with selectable text */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>Sample Quiz Question</Typography>
            <Typography paragraph>
              Select any word in this text to look it up in the dictionary or highlight it. 
              This is a sample question for demonstration purposes.
            </Typography>
          </Paper>

          <SelectionMenu onLookup={handleLookup} onHighlight={handleHighlight} />

          {/* Highlights section */}
          {highlights.length > 0 && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Your Highlights</Typography>
              <List>
                {highlights.map((highlight) => (
                  <ListItem key={highlight.id} sx={{ bgcolor: highlight.color + '40', borderRadius: 1, mb: 1 }}>
                    <ListItemText 
                      primary={highlight.text} 
                      secondary={highlight.note ? `Note: ${highlight.note}` : 'No note added'} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {showDictionary && status === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {showDictionary && status === 'failed' && (
            <Typography color="error" sx={{ my: 2 }}>
              {error}
            </Typography>
          )}

          {showDictionary && status === 'succeeded' && data && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" gutterBottom>{data.word}</Typography>
              
              {data.phonetics?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {data.phonetics.find(p => p.text) && (
                    <Typography variant="subtitle1">
                      Pronunciation: {data.phonetics.find(p => p.text)?.text}
                    </Typography>
                  )}
                  {data.phonetics.find(p => p.audio) && (
                    <audio controls src={data.phonetics.find(p => p.audio)?.audio}>
                      Your browser does not support audio elements.
                    </audio>
                  )}
                </Box>
              )}
              
              {data.meanings?.map((meaning, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6">{meaning.partOfSpeech}</Typography>
                  
                  <Typography variant="subtitle1">Definitions:</Typography>
                  <ul>
                    {meaning.definitions.map((def, idx) => (
                      <li key={idx}>
                        <Typography>{def.definition}</Typography>
                        {def.example && (
                          <Typography variant="body2" color="textSecondary">
                            Example: "{def.example}"
                          </Typography>
                        )}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Dialog for adding notes to highlights */}
      <Dialog open={showNoteDialog} onClose={() => setShowNoteDialog(false)}>
        <DialogTitle>Add Note to Highlight</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Selected text: <strong>{currentHighlight}</strong>
          </Typography>
          <TextField
            autoFocus
            label="Your Note"
            fullWidth
            multiline
            rows={3}
            value={highlightNote}
            onChange={(e) => setHighlightNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveHighlight} variant="contained" color="primary">
            Save Highlight
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
