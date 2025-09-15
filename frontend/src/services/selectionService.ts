export const getSelectedText = (): {
  text: string;
  range: Range | null;
  isMobile: boolean;
} => {
  const selection = window.getSelection();
  const text = selection?.toString().trim() || "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return {
    text,
    range: selection?.rangeCount ? selection.getRangeAt(0) : null,
    isMobile
  };
};

// Get position for selection menu with mobile adjustments
export const getSelectionPosition = (range: Range | null): { top: number; left: number } => {
  if (!range) {
    return { top: 0, left: 0 };
  }

  const rect = range.getBoundingClientRect();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, position the menu above the selection to avoid keyboard
    return {
      top: Math.max(rect.top + window.scrollY - 50, window.scrollY + 10),
      left: Math.max(
        Math.min(rect.left + window.scrollX + (rect.width / 2), 
        window.innerWidth - 100),
        window.scrollX + 50
      )
    };
  }

  // Desktop positioning
  return {
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX + (rect.width / 2)
  };
}

export const getTextedPosition = (): {
  text: string;
  range: Range | null;
  position: {
    paragraphIndex: number;
    startOffset: number;
    endOffset: number;
  } | null;
} => {
  const selection = window.getSelection();
  const text = selection?.toString().trim() || "";
  
  if (!selection || selection.rangeCount === 0 || text === "") {
    return { text: "", range: null, position: null };
  }
  const range = selection.getRangeAt(0);

  // find the paragraph containing the selection
  let paragraphNode: Node | null = range.startContainer;
  while (paragraphNode && paragraphNode.nodeName !== "P") {
    paragraphNode = paragraphNode.parentNode as Node;
  }

  if (!paragraphNode) {
    return { text, range, position: null };
  }

  // find the index of the paragraph in the document
  const paragraphs = document.querySelectorAll('.selectable-text');
  const paragraphIndex = Array.from(paragraphs).indexOf(paragraphNode as Element);

  if (paragraphIndex === -1) {
    return { text, range, position: null };
  }

  return {
    text,
    range,
    position: {
      paragraphIndex,
      startOffset: range.startOffset,
      endOffset: range.endOffset
    }
  };
};


// Helper for iOS-specific selection issues
export const initMobileTextSelection = (): void => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  if (isIOS) {
    document.addEventListener('touchstart', function(e) {
      if (e.target && (e.target as HTMLElement).classList.contains('selectable-text')) {
        return;
      }
    }, { passive: false });
    
    // Prevent the popup menu on iOS
    document.addEventListener('touchend', function(e) {
      if (e.target && (e.target as HTMLElement).classList.contains('selectable-text')) {
        e.preventDefault();
      }
    }, false);
    
    // Use gesturestart to intercept iOS text selection UI
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    }, false);
  } else {
    document.addEventListener('touchstart', function() {}, false);
  }
  
  // Add proper viewport settings for iOS
  const existingMeta = document.querySelector('meta[name="viewport"]');
  if (!existingMeta) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
  
  // Add iOS-specific CSS to hide selection UI
  const style = document.createElement('style');
  style.textContent = `
    /* Disable iOS text selection UI */
    .selectable-text {
      -webkit-touch-callout: none;
      -webkit-user-select: text;
      user-select: text;
    }
    
    /* Only apply this to non-input elements */
    .selectable-text:not(input):not(textarea) {
      -webkit-tap-highlight-color: transparent;
    }
  `;
  document.head.appendChild(style);
};

// Get selection with delay for mobile devices
export const getMobileSelection = async (): Promise<{
  text: string;
  range: Range | null;
}> => {
  return new Promise(resolve => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const delay = isIOS ? 600 : 300;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";
      
      if (isIOS && text) {
        const range = selection?.getRangeAt(0);
        if (range && selection) {
          const tempRange = range.cloneRange();
          selection.removeAllRanges();
          setTimeout(() => {
            if (selection) {
              selection.addRange(tempRange);
              resolve({
                text,
                range: tempRange
              });
            }
          }, 50);
          return;
        }
      }
      
      resolve({
        text,
        range: selection?.rangeCount ? selection.getRangeAt(0) : null
      });
    }, delay);
  });
};

// Add a new function to specifically handle iOS selection issues
export const suppressIOSTextSelection = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (!isIOS) return;
  
  // Force deselect any text to prevent iOS menu
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();
};
