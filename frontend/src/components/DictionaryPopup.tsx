import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordData {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

interface DictionaryPopupProps {
  open: boolean;
  onClose: () => void;
  word: string;
  data: WordData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const DictionaryPopup: React.FC<DictionaryPopupProps> = ({
  open,
  onClose,
  word,
  data,
  status,
  error,
}) => {
  const [showMore, setShowMore] = useState(false);

  const handlePlayAudio = () => {
    if (data?.phonetics) {
      const audioUrl = data.phonetics.find((p) => p.audio)?.audio;
      if (audioUrl) {
        new Audio(audioUrl).play();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pb: 1,
          px: 3,
          pt: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {status === "failed" && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error.main" sx={{ my: 2 }}>
              {error || "Couldn't find this word. Please try another one."}
            </Typography>
          </Box>
        )}

        {status === "succeeded" && data && (
          <Box>
            <Typography
              variant="h5"
              component="div"
              fontWeight="500"
              sx={{ px: 3, py: 1 }}
            >
              {word}
            </Typography>
            {/* Pronunciation Section */}
            {data.phonetics?.length > 0 && (
              <Box
                sx={{
                  px: 3,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {data.phonetics.find((p) => p.text) && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {data.phonetics.find((p) => p.text)?.text}
                  </Typography>
                )}
                {data.phonetics.find((p) => p.audio) && (
                  <IconButton
                    color="primary"
                    onClick={handlePlayAudio}
                    size="small"
                    sx={{
                      bgcolor: "primary.50",
                      "&:hover": {
                        bgcolor: "primary.100",
                      },
                    }}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                )}
              </Box>
            )}

            <Divider />

            {/* Condensed View */}
            {!showMore && data.meanings?.length > 0 && (
              <Box sx={{ px: 3, py: 2 }}>
                {data.meanings.slice(0, 1).map((meaning, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Chip
                      label={meaning.partOfSpeech}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1.5, fontWeight: 500 }}
                    />

                    {meaning.definitions.slice(0, 2).map((def, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {def.definition}
                        </Typography>
                        {def.example && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              fontStyle: "italic",
                              pl: 2,
                              borderLeft: "2px solid",
                              borderColor: "primary.200",
                              py: 0.5,
                            }}
                          >
                            "{def.example}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}

                <Button
                  onClick={() => setShowMore(true)}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Show More
                </Button>
              </Box>
            )}

            {/* Expanded View */}
            {showMore && (
              <Box sx={{ px: 3, py: 2 }}>
                {data.meanings?.map((meaning, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Chip
                      label={meaning.partOfSpeech}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1.5, fontWeight: 500 }}
                    />

                    {meaning.definitions.map((def, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {def.definition}
                        </Typography>
                        {def.example && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              fontStyle: "italic",
                              pl: 2,
                              borderLeft: "2px solid",
                              borderColor: "primary.200",
                              py: 0.5,
                            }}
                          >
                            "{def.example}"
                          </Typography>
                        )}

                        {/* Synonyms & Antonyms */}
                        {def.synonyms && def.synonyms.length > 0 && (
                          <Box
                            sx={{
                              mt: 1.5,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              Synonyms:
                            </Typography>
                            {def.synonyms.slice(0, 5).map((syn, sidx) => (
                              <Chip
                                key={sidx}
                                label={syn}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 24,
                                  fontSize: "0.75rem",
                                  bgcolor: "background.paper",
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}

                <Button
                  onClick={() => setShowMore(false)}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Show Less
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DictionaryPopup;
