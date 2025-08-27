"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface DemoIframeProps {
  src: string;
  title?: string;
}

const DemoIframe: React.FC<DemoIframeProps> = ({ src, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => setIsLoading(false);
  return (
    <div className="my-5">
      <div className="relative w-full h-[500px] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
        )}

        <iframe
          src={src}
          title={title || "Demo Iframe"}
          onLoad={handleLoad}
          className={`w-full h-full border-none transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
      <Button
        className="cursor-pointer mt-2 text-xs"
        onClick={() => window.open(src, "_blank")}
      >
        브라우저로 보기
      </Button>
    </div>
  );
};

export default DemoIframe;
