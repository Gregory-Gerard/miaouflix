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
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { z } from 'zod';
import { addWatchedMovie } from '@/services/watched-movie';

type PlayerProps = {
  id: number;
  src: string;
  title: string;
  poster: string;
};

export default function Player({ id, src, title, poster }: PlayerProps) {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const loadPreviousTime = useLoadPreviousTime({ id, videoPlayerRef });
  const saveCurrentTime = useSaveCurrentTime({ id, videoPlayerRef });

  useEffect(() => {
    const hlsInstance = new HLS();

    if (videoPlayerRef.current) {
      if (HLS.isSupported()) {
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(videoPlayerRef.current);
      } else {
        videoPlayerRef.current.src = src;
      }

      // Try to open video in fullscreen
      const mediaControllerFullscreenBtn =
        videoPlayerRef.current.parentElement?.querySelector('media-fullscreen-button');

      if (mediaControllerFullscreenBtn instanceof HTMLElement) {
        mediaControllerFullscreenBtn.click();
      }
    }

    return () => {
      hlsInstance.stopLoad();
      hlsInstance.detachMedia();
      hlsInstance.destroy();
    };
  }, [src]);

  return (
    <MediaController className="block h-screen w-screen" autohide={5}>
      <video
        slot="media"
        ref={videoPlayerRef}
        preload="metadata"
        poster={poster}
        className="h-full w-full object-contain"
        onLoadedMetadata={loadPreviousTime}
        onTimeUpdate={saveCurrentTime}
      />

      <div
        slot="top-chrome"
        className="flex w-full items-center justify-between bg-gradient-to-b from-black/90 px-5 pb-10 pt-4"
      >
        <div className="h-8 w-8">{/* fake div for pixel perfect centered title */}</div>
        <h1 className="grow-0 truncate text-center text-sm font-bold tracking-wider md:text-xl">{title}</h1>
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

const LOCALSTORAGE_WATCHED_TIMES_BY_MOVIES_KEY = 'currentWatchedTimesByMovies';

const useSaveCurrentTime = ({ id, videoPlayerRef }: { id: number; videoPlayerRef: RefObject<HTMLVideoElement> }) => {
  return useCallback(() => {
    if (!videoPlayerRef.current) {
      return;
    }

    const currentWatchedTimesByMovies = getCurrentWatchedTimesByMovies();

    localStorage.setItem(
      LOCALSTORAGE_WATCHED_TIMES_BY_MOVIES_KEY,
      JSON.stringify({
        ...currentWatchedTimesByMovies,
        [id.toString()]: videoPlayerRef.current.currentTime,
      })
    );

    // If user watch 1/10th of movie, we add it to watched movies list
    if (videoPlayerRef.current.currentTime > videoPlayerRef.current.duration / 10) {
      addWatchedMovie({ tmdbId: id, date: new Date() });
    }
  }, [id, videoPlayerRef]);
};

const useLoadPreviousTime = ({ id, videoPlayerRef }: { id: number; videoPlayerRef: RefObject<HTMLVideoElement> }) => {
  return useCallback(() => {
    if (!videoPlayerRef.current) {
      return;
    }

    const currentWatchedTimesByMovies = getCurrentWatchedTimesByMovies();

    if (!currentWatchedTimesByMovies[id.toString()]) {
      return;
    }

    // If user watch 90% of movie, do nothing
    if ((currentWatchedTimesByMovies[id.toString()] / videoPlayerRef.current.duration) * 100 > 90) {
      return;
    }

    // If user watch less than 5% of movie, do nothing
    if ((currentWatchedTimesByMovies[id.toString()] / videoPlayerRef.current.duration) * 100 < 5) {
      return;
    }

    videoPlayerRef.current.currentTime = currentWatchedTimesByMovies[id.toString()];
  }, [id, videoPlayerRef]);
};

const getCurrentWatchedTimesByMovies = (): Record<string, number> => {
  const currentWatchedTimesByMovies = z
    .record(z.number())
    .safeParse(JSON.parse(localStorage.getItem(LOCALSTORAGE_WATCHED_TIMES_BY_MOVIES_KEY) || '{}'));

  return currentWatchedTimesByMovies.success ? currentWatchedTimesByMovies.data : {};
};
