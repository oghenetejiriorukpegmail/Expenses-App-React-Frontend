import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Optional plugins
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ReceiptViewerModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to get theme preference (can be shared)
const getThemePreference = (): 'dark' | 'light' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({ imageUrl, isOpen, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(getThemePreference());

  // Effect to update theme if it changes while modal might be open
  useEffect(() => {
     const observer = new MutationObserver(() => {
        setCurrentTheme(getThemePreference());
     });
     observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
     return () => observer.disconnect();
  }, []);


  if (!isOpen || !imageUrl) {
    return null;
  }

  const slides = [{ src: imageUrl }];

  // Define styles based on theme
  const lightboxStyles = {
    container: {
      backgroundColor: currentTheme === 'dark'
        ? "rgba(17, 24, 39, 0.9)" // Darker background (e.g., gray-900 with alpha)
        : "rgba(0, 0, 0, 0.8)"   // Default dark background
    }
  };

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      plugins={[Zoom, Thumbnails]}
      styles={lightboxStyles} // Apply dynamic styles
      zoom={{ maxZoomPixelRatio: 3 }}
      thumbnails={{ position: "bottom" }}
    />
  );
};

export default ReceiptViewerModal;