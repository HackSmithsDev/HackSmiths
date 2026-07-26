'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  size?: number;
  showLabel?: boolean;
}

export default function ApplicationQRCode({ size = 200, showLabel = true }: QRCodeProps) {
  // Uses your actual domain in production, or falls back to relative path
  const targetUrl = "https://hacksmiths.dev/application/";

  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-[#09090b] border border-[#18181b] rounded-xl shadow-2xl">
      {/* White background container ensures scanner cameras read high-contrast code easily */}
      <div className="p-3 bg-white rounded-lg">
        <QRCodeSVG
          value={targetUrl}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#09090b" // Dark background matching your theme
          level="H"         // High error correction
          includeMargin={false}
        />
      </div>

      {showLabel && (
        <div className="text-center font-mono">
          <p className="text-[11px] text-zinc-400 uppercase tracking-widest">
            Scan to Apply
          </p>
          <p className="text-xs text-indigo-400 font-bold mt-0.5">
            hacksmiths.dev/application
          </p>
        </div>
      )}
    </div>
  );
}