import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Tooltip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useAppSelector } from "../app/hooks";

const EnglishTest: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const { highlights } = useAppSelector(state => state.highlights);

  const paragraphs = [
    "The concept of sustainability has gained significant traction in recent years. Sustainability refers to meeting our present needs without compromising the ability of future generations to meet their own needs. This approach integrates three main pillars: environmental protection, social responsibility, and economic viability.",
    "Environmental sustainability focuses on maintaining the quality of our natural resources and ensuring the long-term health of our planet. This includes reducing carbon emissions, conserving biodiversity, and preventing pollution. Organizations increasingly implement practices such as renewable energy usage and waste reduction to minimize their ecological footprint.",
    "Social sustainability addresses human rights, equity, and community well-being. It promotes fair labor practices, diversity and inclusion, and community engagement. Companies that prioritize social sustainability create positive impacts for their employees, customers, and communities.",
    "Economic sustainability ensures that businesses can maintain profitability while adhering to environmental and social standards. This dimension emphasizes long-term financial planning, responsible investment, and ethical business practices. Sustainable economic models often lead to innovation, efficiency improvements, and enhanced brand reputation."
  ];

  const renderParagraphWithHighlights = (text: string, paragraphIndex: number) => {
    const paragraphHighlights = highlights.filter(
      h => h.position && h.position.paragraphIndex === paragraphIndex
    );
    
    if (paragraphHighlights.length === 0) {
      return text; // No highlights in this paragraph
    }
    
    const sortedHighlights = [...paragraphHighlights].sort(
      (a, b) => (a.position?.startOffset || 0) - (b.position?.startOffset || 0)
    );
    
    const segments = [];
    let lastIndex = 0;
    
    for (const highlight of sortedHighlights) {
      if (!highlight.position) continue;
      
      const { startOffset, endOffset } = highlight.position;
      
      if (startOffset > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, startOffset)}
          </span>
        );
      }
      
      segments.push(
        <span 
          key={`highlight-${startOffset}`}
          style={{
            backgroundColor: highlight.color,
            padding: '2px 0',
            borderRadius: '2px'
          }}
        >
          {text.substring(startOffset, endOffset)}
        </span>
      );
      
      lastIndex = endOffset;
    }
    
    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{segments}</>;
  };

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        px: { xs: 2, sm: 3 },
        py: 3,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="500" sx={{ mb: 3 }}>
        Reading Test
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {paragraphs.map((paragraph, index) => (
          <Typography
            key={`paragraph-${index}`}
            variant="body1"
            paragraph
            className="selectable-text"
            sx={{
              lineHeight: 1.7,
              color: "text.primary",
              fontSize: "1.05rem",
            }}
          >
            {renderParagraphWithHighlights(paragraph, index)}
          </Typography>
        ))}
      </Box>

      {/* Help button (shows when instructions are hidden) */}
      {!showInstructions && (
        <Tooltip title="Show instructions">
          <IconButton
            onClick={() => setShowInstructions(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 10,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      )}

      <Collapse in={showInstructions}>
        <Box
          sx={{
            mb: 5,
            p: 2.5,
            bgcolor: "rgba(0, 0, 0, 0.02)",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setShowInstructions(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Reading Comprehension Task:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select words you don't understand to look them up in the dictionary.
            Highlight important concepts to create your study notes.
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: "0.8rem",
            }}
          >
            Mark as Completed
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default EnglishTest;
