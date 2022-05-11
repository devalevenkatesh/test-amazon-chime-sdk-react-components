import * as React from 'react';
import {
  useRemoteVideoTileState,
  useRosterState,
  useAudioVideo,
  useApplyVideoObjectFit,
  VideoTile,
  RosterAttendeeType
} from 'amazon-chime-sdk-component-library-react';


// Copied from the React SDK, added cleanup and replaced className by some simple styles for the example.
const RemoteVideo: React.FC<any> = ({
  name,
  tileId,
  ...rest
}) => {
  const audioVideo = useAudioVideo();
  const videoEl = React.useRef<HTMLVideoElement>(null);
  useApplyVideoObjectFit(videoEl);

  React.useEffect(() => {
    if (!audioVideo || !videoEl.current) {
      return;
    }
    audioVideo.bindVideoElement(tileId, videoEl.current);
    return () => {
      const tile = audioVideo.getVideoTile(tileId);
      if (tile) {
        audioVideo.unbindVideoElement(tileId);
      }
    }
  }, [audioVideo, tileId]);

  return (
    <VideoTile
      {...rest}
      ref={videoEl}
      nameplate={name}
      style={{width: 300, height: 169}}
    />
  );
};

export const Pagination = () => {
  const { roster } = useRosterState();
  const [startIndex, setStartIndex] = React.useState(0);
  const [stopInterval, setStopInterval] = React.useState(false);

  const PER_PAGE = 3;
  const total = Object.keys(roster).length;
  const attendees = Object.values(roster).slice(startIndex, startIndex + PER_PAGE);
  console.log({ startIndex, attendees, total });

  React.useEffect(() => {
    if (total < 5) {
      return;
    }
    const timer = setTimeout(() => {
      setStopInterval(true);
    }, 120000);

    return () => {
      clearTimeout(timer);
    }
  }, [total]);

  React.useEffect(() => {
    if (total < 5) {
      return;
    }
    const intervalI2 = setInterval(() => {
      setStartIndex(Math.min(total - 1, startIndex + PER_PAGE))
    }, 2000);

    const intervalId1 = setInterval(() => {
      setStartIndex(Math.max(0, startIndex - PER_PAGE));
    }, 5000);

    if (stopInterval) {
      clearInterval(intervalId1);
      clearInterval(intervalI2);
    }

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalI2);
    }
  }, [total, stopInterval]);

  return (
    <div style={{ width: 1000, height: 800 }}>
      {/* {startIndex > 0 && (
        <button onClick={() => setStartIndex(Math.max(0, startIndex - PER_PAGE))}>Previous page</button>
      )}
      {startIndex < total && (
        <button onClick={() => setStartIndex(Math.min(total - 1, startIndex + PER_PAGE))}>Next page</button>
      )} */}
      {`startIndex: ${startIndex}`}
      {<RemoteVideos attendees={attendees} />}
    </div>
  )
}

interface Props {
  attendees: RosterAttendeeType[];
}

export const RemoteVideos: React.FC<Props> = ({attendees}) => {
  const { attendeeIdToTileId } = useRemoteVideoTileState();

  return (
    <div style={{display: 'grid'}}>
        {attendees.map(attendee => {
          if (attendeeIdToTileId[attendee.chimeAttendeeId]) {
            return (
              <RemoteVideo
              key={attendee.chimeAttendeeId}
              name={attendee.name}
              attendeeId={attendee.chimeAttendeeId}
              tileId={attendeeIdToTileId[attendee.chimeAttendeeId]}
              nameplate={attendee.name}
            />
            );
          }
        })}
      </div>
  );
}