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

const EnglishTest: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);

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
        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          The concept of sustainability has gained significant traction in
          recent years. Sustainability refers to meeting our present needs
          without compromising the ability of future generations to meet their
          own needs. This approach integrates three main pillars: environmental
          protection, social responsibility, and economic viability.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          Environmental sustainability focuses on maintaining the quality of our
          natural resources and ensuring the long-term health of our planet.
          This includes reducing carbon emissions, conserving biodiversity, and
          preventing pollution. Organizations increasingly implement practices
          such as renewable energy usage and waste reduction to minimize their
          ecological footprint.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          Social sustainability addresses human rights, equity, and community
          well-being. It promotes fair labor practices, diversity and inclusion,
          and community engagement. Companies that prioritize social
          sustainability create positive impacts for their employees, customers,
          and communities.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          Economic sustainability ensures that businesses can maintain
          profitability while adhering to environmental and social standards.
          This dimension emphasizes long-term financial planning, responsible
          investment, and ethical business practices. Sustainable economic
          models often lead to innovation, efficiency improvements, and enhanced
          brand reputation.
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          The integration of these three dimensions presents both challenges and
          opportunities. Organizations must balance short-term financial goals
          with long-term sustainability objectives. However, those that
          successfully implement sustainable practices often gain competitive
          advantages, including cost savings, improved stakeholder relations,
          and enhanced market positioning.
        </Typography>
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

      {/* Instruction Box with animation */}
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
          {/* Close button */}
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
            variant="outlined"
            size="small"
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
