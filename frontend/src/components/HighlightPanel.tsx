import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
  TextField,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Highlight } from "../services/highlightService";
import { useAppDispatch } from "../app/hooks";
import { updateHighlight as apiUpdateHighlight, deleteHighlight as apiDeleteHighlight } from "../services/api";
import { removeHighlight, updateHighlight } from "../slice/highlightSlice";

interface HighlightPanelProps {
  highlights: Highlight[];
  onLookup: (text: string) => void;
  onDelete?: () => void; 
}

export function HighlightPanel({ highlights, onLookup, onDelete }: HighlightPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const dispatch = useAppDispatch();
  
  // Debug unique IDs
  useEffect(() => {
    const ids = highlights.map(h => h.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('Duplicate highlight IDs detected:', 
        ids.filter((id, index) => ids.indexOf(id) !== index));
    }
  }, [highlights]);

  const handleEdit = (highlight: Highlight) => {
    setEditingId(highlight.id);
    setEditNote(highlight.note || "");
  };

  const handleSave = async (id: string) => {
    try {
      console.log(`Saving highlight with ID: ${id}`);
      const updated = await apiUpdateHighlight(id, { note: editNote });
      dispatch(updateHighlight({ id: updated.id, note: updated.note || "" }));
      setEditingId(null);
      setEditNote("");
    } catch (error) {
      console.error("Failed to update highlight:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting highlight with ID: ${id}`);
      await apiDeleteHighlight(id);
      dispatch(removeHighlight(id));
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete highlight:", error);
    }
  };

  const handleWordClick = (text: string) => {
    onLookup(text);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(0, 0, 0, 0.01)'
        }}
      >
        <Typography variant="h6" fontWeight="500">
          Your Highlights {highlights.length > 0 && `(${highlights.length})`}
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} sx={{ flexGrow: 1, overflowY: "auto" }}>
        {highlights.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No highlights yet. Select text to highlight.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {/* Use composite key of ID + index to ensure uniqueness */}
            {highlights.map((highlight, index) => (
              <React.Fragment key={`${highlight.id}-${index}`}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    p: 0,
                    display: 'block'
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 2,
                      borderLeft: '3px solid',
                      borderColor: highlight.color || '#ffeb3b',
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography
                        fontWeight="medium"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline", color: 'primary.main' },
                        }}
                        onClick={() => handleWordClick(highlight.text)}
                      >
                        {highlight.text}
                      </Typography>
                      <Box>
                        {editingId === highlight.id ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                size="small"
                                onClick={() => handleSave(highlight.id)}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                onClick={() => setEditingId(null)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit note">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(highlight)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(highlight.id)}
                                data-highlight-id={highlight.id}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Box>

                    {editingId === highlight.id ? (
                      <TextField
                        fullWidth
                        multiline
                        size="small"
                        placeholder="Add a note..."
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    ) : highlight.note ? (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: 'text.secondary' }}
                      >
                        {highlight.note}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, fontStyle: "italic", color: 'text.disabled' }}
                      >
                        No note added
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {new Date(highlight.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Collapse>
    </Paper>
  );
}

export default HighlightPanel;