import * as React from 'react';
import {
  useRemoteVideoTileState,
  useAudioVideo,
  useApplyVideoObjectFit,
  VideoTile,
  useMeetingManager
} from 'amazon-chime-sdk-component-library-react';
import { Attendee, MutableVideoPreferences, TargetDisplaySize, VideoPreference, VideoPreferences, VideoPriorityBasedPolicy, VideoSource } from 'amazon-chime-sdk-js';


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
      console.log('Un-mounting', tileId);
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
  const meetingManager = useMeetingManager();
  const audioVideo = useAudioVideo();
  const [remoteAttendees, setRemoteAttendees] = React.useState<Attendee[]>([]);
  const [startIndex, setStartIndex] = React.useState(0);

  const PER_PAGE = 2;
  const total = Object.keys(remoteAttendees).length;
  const attendees = Object.values(remoteAttendees).slice(startIndex, startIndex + PER_PAGE);
  console.log({ startIndex, attendees, total });

  React.useEffect(() => {
    if (!audioVideo) {
      return;
    }
    const observer = {
      remoteVideoSourcesDidChange: (videoSources: VideoSource[]) => {
        const remoteAttendeesSharingVideo = videoSources.map(videoSource => videoSource.attendee);
        setRemoteAttendees(remoteAttendeesSharingVideo);
      }
    }
    audioVideo?.addObserver(observer);

    return () => {
      audioVideo?.removeObserver(observer);
    }
  }, [audioVideo]);

  React.useEffect(() => {
    if (!meetingManager || !meetingManager.videoDownlinkBandwidthPolicy) {
      return;
    }
    const videoPreferences: MutableVideoPreferences = VideoPreferences.prepare();
    attendees.forEach((attendee) => {
      videoPreferences.add(new VideoPreference(attendee.attendeeId, 1, TargetDisplaySize.High))
    });
    (meetingManager.videoDownlinkBandwidthPolicy as VideoPriorityBasedPolicy).chooseRemoteVideoSources(videoPreferences.build());
  }, [meetingManager, attendees]);

  return (
    <div style={{ width: 1000, height: 800 }}>
      {startIndex > 0 && (
        <button onClick={() => setStartIndex(Math.max(0, startIndex - PER_PAGE))}>Previous page</button>
      )}
      {startIndex < total && (
        <button onClick={() => setStartIndex(Math.min(total - 1, startIndex + PER_PAGE))}>Next page</button>
      )}
      {<RemoteVideos attendees={attendees} />}
      {}
    </div>
  )
}

interface Props {
  attendees: Attendee[];
}

export const RemoteVideos: React.FC<Props> = ({attendees}) => {
  const { attendeeIdToTileId } = useRemoteVideoTileState();

  return (
    <div style={{display: 'grid'}}>
        {attendees.map(attendee => {
          if (attendeeIdToTileId[attendee.attendeeId]) {
            return (
              <RemoteVideo
                key={attendeeIdToTileId[attendee.attendeeId]}
                attendeeId={attendee.attendeeId}
                tileId={attendeeIdToTileId[attendee.attendeeId]}
              />
            );
          }
        })}
      </div>
  );
}