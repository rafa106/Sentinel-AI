import React, { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
}

export default function AdUnit({ slot }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden my-6 bg-security-card/30 border border-dashed border-security-border rounded-xl p-2 flex items-center justify-center">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true" />
    </div>
  );
}
