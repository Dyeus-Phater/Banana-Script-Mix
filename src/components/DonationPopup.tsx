import React from 'react';
import { X } from 'lucide-react';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationPopup({ isOpen, onClose }: DonationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-800">About & Support</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-yellow-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">GitHub Repository</h3>
            <a
              href="https://github.com/yourusername/banana-script-mix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-600 hover:text-yellow-700 underline"
            >
              github.com/yourusername/banana-script-mix
            </a>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Support via Lightning Network</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhgctdv4exjcmgv9exgdek8pvr5f"
                alt="Lightning Network QR Code"
                className="mx-auto mb-2 w-32 h-32"
              />
              <p className="text-sm text-gray-600 text-center break-all">
                lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhgctdv4exjcmgv9exgdek8pvr5f
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}