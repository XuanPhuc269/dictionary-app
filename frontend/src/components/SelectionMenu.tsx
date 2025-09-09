import React, { useEffect, useState } from 'react';
import { Paper, Button, ButtonGroup, Popover } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { fetchWordDefinition } from '../slice/dictionarySlice';


interface SelectionMenuProps {
    onHighlight: (text: string) => void;
    onLookup: (text: string) => void;
}

export const SelectionMenu: React.FC<SelectionMenuProps> = ({ onHighlight, onLookup }) => {
    const [selectedText, setSelectedText] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim() || '';

            if (text) {
                setSelectedText(text);

                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    setPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX + (rect.width / 2)
                    });
                    setOpen(true);
                }
            } else {
                setOpen(false);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
        };
    }, []);

    const handleLookup = () => {
        onLookup(selectedText);
        setOpen(false);
    };

    const handleHighlight = () => {
        onHighlight(selectedText);
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            anchorReference='anchorPosition'
            anchorPosition={{ top: position.top, left: position.left }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setOpen(false)}
        >
            <Paper sx={{ p: 1 }}>
                <ButtonGroup variant="text" aria-label="text button group" size="small">
                    <Button onClick={handleLookup}>Look Up</Button>
                    <Button onClick={handleHighlight}>Highlight</Button>
                </ButtonGroup>
            </Paper>
        </Popover>
    );
}