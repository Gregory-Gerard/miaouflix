'use client';

import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaMuteButton,
  MediaAirplayButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaLoadingIndicator,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaPreviewTimeDisplay,
} from 'media-chrome/dist/react';
import HLS from 'hls.js';
import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

type PlayerProps = {
  src: string;
  title: string;
  poster: string;
};

export default function Player({ src, title, poster }: PlayerProps) {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hlsInstance = new HLS();

    if (videoPlayerRef.current) {
      if (HLS.isSupported()) {
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(videoPlayerRef.current);
      } else {
        videoPlayerRef.current.src = src;
      }
    }

    return () => {
      hlsInstance.stopLoad();
      hlsInstance.detachMedia();
      hlsInstance.destroy();
    };
  }, [src, videoPlayerRef]);

  return (
    <MediaController className="h-screen w-screen">
      <video
        slot="media"
        ref={videoPlayerRef}
        poster={poster}
        className="h-full w-full object-contain"
      />

      <div
        slot="top-chrome"
        className="flex w-full items-center justify-between bg-gradient-to-b from-black/90 px-5 pt-4 pb-10"
      >
        <div className="h-8 w-8">
          {/* fake div for pixel perfect centered title */}
        </div>
        <h1 className="text-sm font-bold tracking-wider md:text-xl">{title}</h1>
        <Link href="/">
          <XMarkIcon className="h-8 w-8" />
        </Link>
      </div>

      <div slot="centered-chrome">
        <MediaSeekBackwardButton></MediaSeekBackwardButton>
        <MediaLoadingIndicator></MediaLoadingIndicator>
        <MediaPlayButton></MediaPlayButton>
        <MediaSeekForwardButton></MediaSeekForwardButton>
      </div>

      <div className="ytp-gradient-bottom"></div>
      <MediaTimeRange>
        <div slot="preview">
          <MediaPreviewTimeDisplay></MediaPreviewTimeDisplay>
        </div>
      </MediaTimeRange>
      <MediaControlBar>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <div className="relative">
          <MediaMuteButton></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
        </div>
        <span className="grow"></span>
        <MediaAirplayButton></MediaAirplayButton>
        <MediaPipButton></MediaPipButton>
        <MediaFullscreenButton></MediaFullscreenButton>
      </MediaControlBar>
    </MediaController>
  );
}
