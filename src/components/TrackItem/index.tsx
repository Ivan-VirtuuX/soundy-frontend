import React from "react";

import Image from "next/image";

import { IconButton, Tooltip, useMediaQuery } from "@mui/material";

import { PlayIcon } from "@/components/ui/Icons/PlayIcon";
import { PauseIcon } from "@/components/ui/Icons/PauseIcon";
import { PlusIcon } from "@/components/ui/Icons/PlusIcon";
import { CheckMarkIcon } from "@/components/ui/Icons/CheckMarkIcon";

import { Api } from "@/api";
import { ITrack } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./TrackItem.module.scss";

interface TrackItemProps extends ITrack {
  handleClickTrack: ({ id, name, artist, trackSrc, coverUrl }: ITrack) => void;
  currentTrackSrc: string;
  currentTrack: ITrack;
  muted?: boolean;
  handleClickPlay: () => void;
  handleClickStop: () => void;
  playlistTracks: ITrack[];
  isTrackPlaying?: boolean;
  handleAddTrack: (track: ITrack) => void;
  handleRemoveTrack: (track: ITrack) => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  id,
  handleClickTrack,
  currentTrackSrc,
  name,
  artist,
  trackSrc,
  coverUrl,
  currentTrack,
  muted = true,
  handleClickPlay,
  handleClickStop,
  playlistTracks,
  isTrackPlaying,
  handleAddTrack,
  handleRemoveTrack,
}) => {
  const [isAddButtonVisible, setIsAddButtonVisible] = React.useState(false);
  const [isAddedTrack, setIsAddedTrack] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  const removeTrackButtonRef = React.useRef(null);
  const addTrackButtonRef = React.useRef(null);
  const progressBarRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const volumeRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const matches576 = useMediaQuery("(max-width: 576px)");

  const opacityUp = [
    {
      opacity: 0,
      transition: "all 0.3s ease-in-out",
    },
    {
      opacity: 1,
      transition: "all 0.3s ease-in-out",
    },
  ];

  const opacityDown = [
    {
      opacity: 1,
      transition: "all 0.3s ease-in-out",
    },
    {
      opacity: 0,
      transition: "all 0.3s ease-in-out",
    },
  ];

  const timing = {
    duration: 200,
    iterations: 1,
  };

  const onClickPause = () => {
    setIsPlaying(false);

    playerRef?.current?.pause();

    handleClickStop();

    cancelAnimationFrame(animationRef.current);
  };

  const onClickStart = () => {
    setIsPlaying(true);

    playerRef?.current?.play();

    handleClickPlay();

    animationRef.current = requestAnimationFrame(whilePlaying);

    handleClickTrack({ id, name, artist, trackSrc, coverUrl });
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const onChangeRange = () => {
    if (progressBarRef.current) {
      playerRef.current.currentTime = progressBarRef.current.value;

      changePlayerCurrentTime();
    }
  };

  const whilePlaying = () => {
    if (progressBarRef.current) {
      progressBarRef.current.value = playerRef?.current?.currentTime;

      changePlayerCurrentTime();

      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changePlayerCurrentTime = () => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty(
        "--width",
        `${(progressBarRef.current.value / playerRef.current.duration) * 100}%`
      );

      setCurrentTime(progressBarRef.current.value);
    }
  };

  const onChangeVolume = (e) => {
    playerRef.current.volume = e.target.value;

    volumeRef.current.style.setProperty(
      "--width",
      `${(e.target.value * 100) / 0.5}%`
    );
  };

  const onMouseEnterTrack = () => {
    if (id !== currentTrack?.id) {
      setIsAddButtonVisible(true);

      if (containerRef.current && muted)
        containerRef.current.style.background = "#f9f9f9";

      addTrackButtonRef?.current?.animate(opacityUp, timing);
    }
  };

  const onMouseLeaveTrack = () => {
    if (id !== currentTrack?.id) {
      addTrackButtonRef?.current?.animate(opacityDown, timing);

      if (containerRef.current && muted)
        containerRef.current.style.background = "transparent";

      setTimeout(() => {
        setIsAddButtonVisible(false);
      }, 150);
    }
  };

  const onAddToUserPlaylist = async () => {
    try {
      setIsAddedTrack(true);

      await Api().user.toggleMusicTrack(
        userData?.userId,
        {
          id,
          name,
          artist,
          trackSrc,
          coverUrl,
        },
        "add"
      );

      await handleAddTrack({ id, name, artist, trackSrc, coverUrl });
    } catch (err) {
      console.warn(err);
    }
  };

  const onRemoveFromUserPlaylist = async () => {
    try {
      setIsAddedTrack(false);

      await Api().user.toggleMusicTrack(
        userData?.userId,
        {
          id,
          name,
          artist,
          trackSrc,
          coverUrl,
        },
        "remove"
      );

      await handleRemoveTrack({ id, name, artist, trackSrc, coverUrl });
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    if (progressBarRef.current) {
      const seconds = Math.floor(playerRef?.current?.duration);

      setDuration(seconds);

      progressBarRef.current.max = seconds;

      volumeRef.current.max = 0.5;
    }
  }, [playerRef?.current?.loadedmetadata, playerRef?.current?.readyState]);

  React.useEffect(() => {
    playlistTracks?.find((track) => track.id === id)
      ? setIsAddedTrack(true)
      : setIsAddedTrack(false);
  }, [trackSrc, playlistTracks]);

  React.useEffect(() => {
    if (playerRef.current) {
      if (muted) playerRef.current.volume = 0;
      else playerRef.current.volume = 0.1;

      const seconds = Math.floor(playerRef.current.duration);

      setDuration(seconds);
    }
  }, [trackSrc]);

  React.useEffect(() => {
    if (id !== currentTrack?.id) {
      progressBarRef.current && setCurrentTime(0);

      if (playerRef.current) playerRef.current.currentTime = 0;
    } else {
      if (volumeRef.current) {
        volumeRef.current.style.setProperty(
          "--width",
          `${(volumeRef.current.value / 0.5) * 100}%`
        );
      }
    }
  }, [currentTrackSrc]);

  React.useEffect(() => {
    if (id === currentTrack?.id) {
      if (isTrackPlaying) {
        onClickStart();

        setIsPlaying(true);
      } else {
        onClickPause();

        setIsPlaying(false);
      }
    } else {
      onClickPause();

      setIsPlaying(false);
    }
  }, [currentTrack?.id, isTrackPlaying]);

  React.useEffect(() => {
    isAddButtonVisible
      ? addTrackButtonRef?.current?.animate(opacityUp, timing)
      : addTrackButtonRef?.current?.animate(opacityDown, timing);
  }, [isAddButtonVisible]);

  return (
    <li className={styles.wrapper}>
      <div
        className={styles.container}
        onMouseEnter={onMouseEnterTrack}
        onMouseLeave={onMouseLeaveTrack}
        style={{
          padding: id === currentTrack?.id && !muted ? 0 : "15px 15px 20px",
          background:
            id === currentTrack?.id && muted ? "#f9f9f9" : "transparent",
        }}
        ref={containerRef}
      >
        <audio
          ref={playerRef}
          src={trackSrc}
          preload="metadata"
          onLoadedMetadata={(e: any) => setDuration(e.target.duration)}
        />
        <div className={styles.leftSide}>
          {!matches576 || muted ? (
            <div className={styles.imageBlock}>
              <Image
                className={styles.image}
                src={coverUrl}
                alt="musicImage"
                quality={100}
                width={65}
                height={65}
              />
              <div
                className={`${
                  id === currentTrack?.id ? styles.overlayOpen : styles.overlay
                }`}
              />
              {isPlaying ? (
                <PauseIcon
                  handleClick={onClickPause}
                  className={`${
                    id === currentTrack?.id
                      ? styles.playButtonOverlayOpen
                      : styles.playButton
                  }`}
                />
              ) : (
                <PlayIcon
                  handleClick={onClickStart}
                  className={`${
                    id === currentTrack?.id
                      ? styles.playButtonOverlayOpen
                      : styles.playButton
                  }`}
                />
              )}
            </div>
          ) : (
            !muted && (
              <div className={styles.trackPlayButtonBlock}>
                {isPlaying ? (
                  <PauseIcon
                    handleClick={onClickPause}
                    className={styles.playButtonActive}
                  />
                ) : (
                  !muted && (
                    <PlayIcon
                      handleClick={onClickStart}
                      className={styles.playButtonActive}
                    />
                  )
                )}
              </div>
            )
          )}
          <div className={styles.trackInfoBlock}>
            {id !== currentTrack?.id ? (
              <>
                <div
                  className={styles.trackHead}
                  style={{ alignItems: "center" }}
                >
                  <div className={styles.trackInfo}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.artist}>{artist}</span>
                  </div>
                  <div className={styles.timeBlock}>
                    {!isAddedTrack ? (
                      isAddButtonVisible && (
                        <Tooltip title="В мою музыку" arrow>
                          <IconButton
                            ref={addTrackButtonRef}
                            size="medium"
                            onClick={onAddToUserPlaylist}
                          >
                            <PlusIcon color="#898989" />
                          </IconButton>
                        </Tooltip>
                      )
                    ) : (
                      <Tooltip title="Удалить трек" arrow>
                        <IconButton
                          ref={removeTrackButtonRef}
                          size="medium"
                          onClick={onRemoveFromUserPlaylist}
                        >
                          <CheckMarkIcon color="#898989" size={14} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <span className={styles.duration}>
                      {duration && !isNaN(duration) && calculateTime(duration)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.trackHead}>
                  <div className={styles.trackInfo}>
                    <span
                      className={styles.name}
                      style={{
                        fontSize: matches576 && !muted ? 17 : 20,
                      }}
                    >
                      {name}
                    </span>
                    <span
                      className={styles.artist}
                      style={{
                        fontSize: matches576 && !muted ? 17 : 20,
                      }}
                    >
                      {artist}
                    </span>
                  </div>
                  <div className={styles.timeBlock}>
                    {!muted && (
                      <div>
                        <input
                          ref={volumeRef}
                          className={styles.volumeBar}
                          type="range"
                          onChange={(e) => onChangeVolume(e)}
                          max={0.5}
                          defaultValue={playerRef?.current?.volume}
                          step={0.01}
                        />
                      </div>
                    )}
                    {!muted &&
                      (!isAddedTrack ? (
                        <Tooltip title="В мою музыку" arrow>
                          <IconButton
                            ref={addTrackButtonRef}
                            size="medium"
                            onClick={onAddToUserPlaylist}
                          >
                            <PlusIcon color="#898989" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Удалить трек" arrow>
                          <IconButton
                            ref={removeTrackButtonRef}
                            size="medium"
                            onClick={onRemoveFromUserPlaylist}
                          >
                            <CheckMarkIcon color="#898989" size={14} />
                          </IconButton>
                        </Tooltip>
                      ))}
                    <div className={styles.timeBlockContainer}>
                      {!muted && (
                        <span className={styles.currentTime}>
                          {calculateTime(currentTime)}
                        </span>
                      )}
                      <span className={styles.duration}>
                        {duration &&
                          !isNaN(duration) &&
                          calculateTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
                {!muted && (
                  <div>
                    <input
                      ref={progressBarRef}
                      className={styles.progressBar}
                      type="range"
                      defaultValue={0}
                      onChange={onChangeRange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
