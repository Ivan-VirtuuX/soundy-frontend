import React from "react";

import Image from "next/image";

import { PlayIcon } from "@/components/UI/Icons/PlayIcon";
import { PauseIcon } from "@/components/UI/Icons/PauseIcon";

import { ITrack } from "@/api/types";

import styles from "./TrackItem.module.scss";

interface TrackItemProps extends ITrack {
  handleClickTrack: (trackSrc: string) => void;
  currentTrackSrc: string;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  handleClickTrack,
  currentTrackSrc,
  name,
  artist,
  trackSrc,
  coverUrl,
}) => {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  const progressBarRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const volumeRef = React.useRef(null);

  React.useEffect(() => {
    playerRef.current.onloadeddata = () => {
      console.log(playerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (progressBarRef.current) {
      const seconds = Math.floor(playerRef?.current?.duration);

      setDuration(seconds);

      progressBarRef.current.max = seconds;
    }
  }, [playerRef?.current?.loadedmetadata, playerRef?.current?.readyState]);

  React.useEffect(() => {
    if (playerRef.current) {
      const seconds = Math.floor(playerRef.current.duration);

      setDuration(seconds);

      playerRef.current.volume = 0.2;
    }
  }, []);

  React.useEffect(() => {
    if (trackSrc !== currentTrackSrc) {
      setIsPlaying(false);

      playerRef.current.pause();

      setCurrentTime(0);

      if (playerRef.current) playerRef.current.currentTime = 0;
    } else {
      if (volumeRef.current)
        volumeRef.current.style.setProperty(
          "--seek-before-width",
          `${0.2 * 100}%`
        );
    }
  }, [currentTrackSrc]);

  const onClickPause = () => {
    setIsPlaying(false);

    playerRef?.current?.pause();

    cancelAnimationFrame(animationRef.current);
  };

  const onClickStart = () => {
    setIsPlaying(true);

    playerRef?.current?.play();

    animationRef.current = requestAnimationFrame(whilePlaying);

    handleClickTrack(trackSrc);
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const onChangeRange = () => {
    playerRef.current.currentTime = progressBarRef.current.value;

    changePlayerCurrentTime();
  };

  const whilePlaying = () => {
    if (progressBarRef.current) {
      progressBarRef.current.value = playerRef?.current?.currentTime;

      changePlayerCurrentTime();

      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changePlayerCurrentTime = () => {
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${(progressBarRef.current.value / duration) * 100}%`
    );

    setCurrentTime(progressBarRef.current.value);
  };

  const onChangeVolume = (e) => {
    playerRef.current.volume = e.target.value;

    volumeRef.current.style.setProperty(
      "--seek-before-width",
      `${playerRef.current.volume * 100}%`
    );
  };

  return (
    <div className={styles.container}>
      <audio
        ref={playerRef}
        src={trackSrc}
        preload="metadata"
        onLoadedMetadata={(e: any) => setDuration(e.target.duration)}
      />
      <div
        className={styles.leftSide}
        style={{ alignItems: !playerRef?.current?.currentTime && "center" }}
      >
        <div className={styles.imageBlock}>
          <Image
            className={styles.image}
            src={coverUrl}
            alt="musicImage"
            quality={100}
            width={65}
            height={65}
          />
          <div className={styles.overlay} />
          {isPlaying ? (
            <PauseIcon
              handleClick={onClickPause}
              className={styles.playButton}
            />
          ) : (
            <PlayIcon
              handleClick={onClickStart}
              className={styles.playButton}
            />
          )}
        </div>
        <div className={styles.trackInfoBlock}>
          {trackSrc === currentTrackSrc ? (
            <>
              <div className={styles.trackHead}>
                <div className={styles.trackInfo}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.artist}>{artist}</span>
                </div>
                <div className={styles.timeBlock}>
                  <div>
                    <input
                      ref={volumeRef}
                      className={styles.volumeBar}
                      type="range"
                      onChange={(e) => onChangeVolume(e)}
                      max={1}
                      step={0.01}
                    />
                  </div>
                  <span className={styles.currentTime}>
                    {calculateTime(currentTime)}
                  </span>
                  <span className={styles.duration}>
                    {duration && !isNaN(duration) && calculateTime(duration)}
                  </span>
                </div>
              </div>
              <input
                ref={progressBarRef}
                className={styles.progressBar}
                type="range"
                defaultValue={0}
                onChange={onChangeRange}
              />
            </>
          ) : (
            <>
              <div className={styles.trackHead}>
                <div className={styles.trackInfo}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.artist}>{artist}</span>
                </div>
                <div className={styles.timeBlock}>
                  <span className={styles.duration}>
                    {duration && !isNaN(duration) && calculateTime(duration)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
