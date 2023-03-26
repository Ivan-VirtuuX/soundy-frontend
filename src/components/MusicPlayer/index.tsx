import React from "react";

import { filterItems } from "@/utils/filterItems";

import { ITrack } from "@/api/types";

import { TrackItem } from "@/components/TrackItem";
import { PreviousTrackIcon } from "@/components/ui/Icons/PreviousTrackIcon";
import { NextTrackIcon } from "@/components/ui/Icons/NextTrackIcon";

import styles from "./MusicPlayer.module.scss";

interface MusicPlayerProps {
  searchText?: string;
  tracks: ITrack[];
  handleChangeUserTracks?: (track: ITrack) => void;
  handleRemoveTrack?: (track: ITrack) => void;
  playlistTracks?: ITrack[];
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  searchText,
  tracks,
  handleChangeUserTracks,
  handleRemoveTrack,
  playlistTracks,
}) => {
  const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] =
    React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState<ITrack>();

  return (
    <div className={styles.tracks}>
      {searchText
        ? filterItems(tracks, ["artist", "name"], searchText).map((track) => (
            <TrackItem
              key={track.id}
              {...track}
              currentTrack={currentTrack}
              currentTrackSrc={currentTrack?.trackSrc}
              handleClickTrack={(track) => setCurrentTrack(track)}
              playlistTracks={playlistTracks}
              handleClickPlay={() => setIsCurrentTrackPlaying(true)}
              handleClickStop={() => setIsCurrentTrackPlaying(false)}
              isTrackPlaying={isCurrentTrackPlaying}
              handleAddTrack={(track) => handleChangeUserTracks(track)}
              handleRemoveTrack={(track) => handleRemoveTrack(track)}
            />
          ))
        : tracks.map((track) => (
            <TrackItem
              key={track.id}
              {...track}
              currentTrack={currentTrack}
              currentTrackSrc={currentTrack?.trackSrc}
              handleClickTrack={(track) => setCurrentTrack(track)}
              playlistTracks={playlistTracks}
              handleClickPlay={() => setIsCurrentTrackPlaying(true)}
              handleClickStop={() => setIsCurrentTrackPlaying(false)}
              isTrackPlaying={isCurrentTrackPlaying}
              handleAddTrack={(track) => handleChangeUserTracks(track)}
              handleRemoveTrack={(track) => handleRemoveTrack(track)}
            />
          ))}
      {currentTrack && (
        <div className={styles.currentTrackBlock}>
          <div className={styles.trackActionsBlock}>
            <PreviousTrackIcon
              handleClick={() =>
                currentTrack.id !== tracks[0].id &&
                setCurrentTrack(
                  tracks[
                    tracks.findIndex((track) => track.id === currentTrack?.id) -
                      1
                  ]
                )
              }
            />
            <NextTrackIcon
              handleClick={() =>
                currentTrack.id !== tracks[tracks.length - 1].id &&
                setCurrentTrack(
                  tracks[
                    tracks.findIndex((track) => track.id === currentTrack?.id) +
                      1
                  ]
                )
              }
            />
          </div>
          <TrackItem
            {...currentTrack}
            currentTrack={currentTrack}
            currentTrackSrc={currentTrack?.trackSrc}
            handleClickTrack={(track) => setCurrentTrack(track)}
            handleClickPlay={() => setIsCurrentTrackPlaying(true)}
            handleClickStop={() => setIsCurrentTrackPlaying(false)}
            isTrackPlaying={isCurrentTrackPlaying}
            playlistTracks={playlistTracks}
            handleAddTrack={(track) => handleChangeUserTracks(track)}
            handleRemoveTrack={(track) => handleRemoveTrack(track)}
            muted={false}
          />
        </div>
      )}
    </div>
  );
};
