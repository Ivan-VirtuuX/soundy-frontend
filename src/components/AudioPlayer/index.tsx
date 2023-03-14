import React from "react";

import Image from "next/image";

import musicImage from "@/public/images/musicImage.png";

import { PlayIcon } from "@/components/UI/Icons/PlayIcon";
import { PauseIcon } from "@/components/UI/Icons/PauseIcon";

import styles from "./AudioPlayer.module.scss";

export const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  const progressBarRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const playerRef = React.useRef(null);

  const onClickPause = () => {
    setIsPlaying(false);

    playerRef.current.pause();

    cancelAnimationFrame(animationRef.current);
  };

  const onClickStart = () => {
    setIsPlaying(true);

    playerRef.current.play();

    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  React.useEffect(() => {
    const seconds = Math.floor(playerRef.current.duration);

    setDuration(seconds);

    playerRef.current.volume = 0.2;

    progressBarRef.current.max = seconds;
  }, [playerRef?.current?.loadedmetadata, playerRef?.current?.readyState]);

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
    progressBarRef.current.value = playerRef.current.currentTime;

    changePlayerCurrentTime();

    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changePlayerCurrentTime = () => {
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${(progressBarRef.current.value / duration) * 100}%`
    );

    setCurrentTime(progressBarRef.current.value);
  };

  return (
    <div className={styles.container}>
      <audio
        ref={playerRef}
        src="/music/ImagineDragonsBirds.mp3"
        preload="metadata"
      ></audio>
      <div className={styles.leftSide}>
        <div className={styles.imageBlock}>
          <Image
            className={styles.image}
            src={musicImage}
            alt="musicImage"
            quality={100}
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
          <div className={styles.trackHead}>
            <div className={styles.trackInfo}>
              <span className={styles.name}>Track name</span>
              <span className={styles.artist}>Track artist</span>
            </div>
            <div className={styles.timeBlock}>
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
        </div>
      </div>
    </div>
  );
};
