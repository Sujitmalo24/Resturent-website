'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  EyeIcon,
  SpeakerWaveIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import { useAccessibility } from '../hooks/useAccessibility';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    highContrast, 
    fontSize, 
    toggleHighContrast, 
    changeFontSize,
    announceToScreenReader 
  } = useAccessibility();

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
    announceToScreenReader(isOpen ? 'Accessibility panel closed' : 'Accessibility panel opened');
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announceToScreenReader(`High contrast ${!highContrast ? 'enabled' : 'disabled'}`);
  };

  const handleFontSizeChange = (size) => {
    changeFontSize(size);
    announceToScreenReader(`Font size changed to ${size}`);
  };

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={handleTogglePanel}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-amber-500 text-black p-3 rounded-full shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility options"
        aria-expanded={isOpen}
      >
        <AdjustmentsHorizontalIcon className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Accessibility Options
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Close accessibility panel"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Visual Options */}
                <div className="mb-6">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Visual
                  </h3>
                  
                  {/* High Contrast */}
                  <div className="mb-4">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">High Contrast</span>
                      <button
                        onClick={handleHighContrastToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                          highContrast ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                        aria-pressed={highContrast}
                        aria-label="Toggle high contrast mode"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            highContrast ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Increases color contrast for better visibility
                    </p>
                  </div>

                  {/* Font Size */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Font Size</label>
                    <div className="space-y-2">
                      {[
                        { value: 'small', label: 'Small' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'large', label: 'Large' },
                        { value: 'extra-large', label: 'Extra Large' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFontSizeChange(option.value)}
                          className={`block w-full text-left px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                            fontSize === option.value
                              ? 'bg-amber-50 border-amber-500 text-amber-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-pressed={fontSize === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Help */}
                <div className="mb-6">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Navigation Help
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><kbd className="bg-gray-200 px-1 rounded">Tab</kbd> - Navigate forward</li>
                      <li><kbd className="bg-gray-200 px-1 rounded">Shift + Tab</kbd> - Navigate backward</li>
                      <li><kbd className="bg-gray-200 px-1 rounded">Enter</kbd> - Activate button/link</li>
                      <li><kbd className="bg-gray-200 px-1 rounded">Esc</kbd> - Close modal/menu</li>
                    </ul>
                  </div>
                </div>

                {/* Screen Reader Info */}
                <div className="mb-6">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <SpeakerWaveIcon className="w-5 h-5 mr-2" />
                    Screen Reader
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      This website is optimized for screen readers with proper ARIA labels, 
                      semantic HTML, and descriptive content.
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Contact us for accessibility assistance:
                  </p>
                  <a 
                    href="mailto:accessibility@savoryhaven.com"
                    className="text-sm text-amber-600 hover:text-amber-700 underline focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
                  >
                    accessibility@savoryhaven.com
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
