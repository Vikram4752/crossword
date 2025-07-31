import React, { useState } from 'react';
import { Copy, Share2, QrCode, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import Modal from '../UI/Modal';
import CrosswordGrid from './CrosswordGrid';

const PuzzlePreviewModal = ({ isOpen, onClose, puzzleData, puzzleId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  const puzzleUrl = `${window.location.origin}/puzzle/${puzzleId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(puzzleUrl);
      toast.success('Puzzle link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const generateQRCode = async () => {
    try {
      const qrUrl = await QRCode.toDataURL(puzzleUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crossword Puzzle',
          text: 'Check out this crossword puzzle!',
          url: puzzleUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const openInNewTab = () => {
    window.open(puzzleUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Puzzle Preview" size="xl">
      <div className="space-y-6">
        {/* Preview Grid */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-4 text-center">
            Puzzle Preview
          </h4>
          {puzzleData && (
            <div className="max-h-96 overflow-auto">
              <CrosswordGrid
                matrix={puzzleData.matrix}
                wordList={puzzleData.wordList}
                showAnswers={true}
              />
            </div>
          )}
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Share this puzzle</h4>
          
          {/* URL Display */}
          <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <input
              type="text"
              value={puzzleUrl}
              readOnly
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Copy size={16} />
              <span>Copy Link</span>
            </button>

            <button
              onClick={shareNative}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>

            <button
              onClick={generateQRCode}
              className="flex items-center space-x-2 btn-secondary"
            >
              <QrCode size={16} />
              <span>QR Code</span>
            </button>

            <button
              onClick={openInNewTab}
              className="flex items-center space-x-2 btn-primary"
            >
              <ExternalLink size={16} />
              <span>Open Puzzle</span>
            </button>
          </div>

          {/* QR Code Display */}
          {showQR && qrCodeUrl && (
            <div className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Scan this QR code to access the puzzle
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="font-medium mb-1">📝 Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Anyone can access this puzzle using the link above</li>
            <li>No login required for solving puzzles</li>
            <li>Scores are only saved for logged-in users</li>
            <li>The puzzle link will remain active permanently</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PuzzlePreviewModal;