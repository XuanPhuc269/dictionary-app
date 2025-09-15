import React, { useEffect, useState, useRef } from 'react';
import { Paper, Button, ButtonGroup, Popover } from '@mui/material';
import { 
  getSelectionPosition, 
  getMobileSelection, 
  initMobileTextSelection,
  suppressIOSTextSelection,
  getTextedPosition 
} from '../services/selectionService';


interface SelectionMenuProps {
    onHighlight: (text: string, position?: {
      paragraphIndex: number;
      startOffset: number;
      endOffset: number;
    }) => void;
    onLookup: (text: string) => void;
}

export const SelectionMenu: React.FC<SelectionMenuProps> = ({ onHighlight, onLookup }) => {
    const [selectedText, setSelectedText] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<{
      paragraphIndex: number;
      startOffset: number;
      endOffset: number;
    } | null>(null);
    const isIOS = useRef(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    useEffect(() => {
        // Initialize mobile-specific handlers
        initMobileTextSelection();
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

        const handleSelection = async (e: MouseEvent | TouchEvent) => {
            // For iOS, we need to prevent default immediately
            if (isIOS.current && e.type === 'touchend') {
                e.preventDefault(); 
            }

            // Different handling for mobile vs desktop
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                setTimeout(async () => {
                    const { text, range } = await getMobileSelection();
                    if (text) {
                        setSelectedText(text);
                        const pos = getSelectionPosition(range);
                        setPosition(pos);
                        setOpen(true);
                        
                        if (isIOS.current) {
                            e.preventDefault();
                        }
                    }
                }, isIOS.current ? 600 : 500); 
            } else {
                // Desktop selection
                const { text, range, position } = getTextedPosition();
                if (text) {
                    setSelectedText(text);
                    setSelectedPosition(position);
                    const pos = getSelectionPosition(range);
                    setPosition(pos);
                    setOpen(true);
                } else {
                    setOpen(false);
                }
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection, { passive: false }); // passive: false is important for iOS

        // iOS-specific selection event handler
        const handleSelectionChange = () => {
            // Only used to detect selection clearing on iOS
            const selection = window.getSelection();
            if (!selection || selection.toString().trim() === '') {
                if (open) {
                    setTimeout(() => setOpen(false), 200);
                }
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [open]);

    const handleLookup = () => {
        onLookup(selectedText);
        setOpen(false);
        suppressIOSTextSelection(); 
    };

    const handleHighlight = () => {
        onHighlight(selectedText, selectedPosition || undefined);
        setOpen(false);
        suppressIOSTextSelection();
    };

    return (
        <Popover
            open={open}
            anchorReference='anchorPosition'
            anchorPosition={{ top: position.top, left: position.left }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => {
                setOpen(false);
                suppressIOSTextSelection(); // Clear iOS selection when closing
            }}
            PaperProps={{
                elevation: 3,
                sx: { 
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <Paper sx={{ p: isMobile ? 1 : 0.5 }}>
                <ButtonGroup 
                    variant="text" 
                    aria-label="text button group" 
                    size={isMobile ? "medium" : "small"}
                    sx={{ 
                        '& .MuiButton-root': {
                            px: isMobile ? 3 : 2,
                            py: isMobile ? 1 : 0.5
                        }
                    }}
                >
                    <Button onClick={handleLookup}>Look Up</Button>
                    <Button onClick={handleHighlight}>Highlight</Button>
                </ButtonGroup>
            </Paper>
        </Popover>
    );
};