import { 
  ChangeEvent,
  useEffect,
  useState
} from 'react';

import {MeetingSessionConfiguration} from 'amazon-chime-sdk-js';

import {
  LocalVideo,
  useMeetingManager,
  useLocalVideo,
  useMeetingStatus,
  MeetingStatus,
  useRemoteVideoTileState,
  RemoteVideo
} from 'amazon-chime-sdk-component-library-react';

function Home() {
  const [meetingName, setMeetingName] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();
  // Get remote video tiles if available and enabled by remote attendees.
  // You can use `RemoteVideos` component if you do not want to manage remote tiles and handle the remote tileId.
  // Simply, remove these two lines and the second useEffect which sets the remote tileId.
  // Change the {remoteTileId && <RemoteVideo tileId={remoteTileId} />} in return method to just <RemoteVideos />
  // `RemoteVideos` internally will handle the same for you but wont be limited to just one tileId.
  const { tiles } = useRemoteVideoTileState();
  const [remoteTileId, setRemoteTileId] = useState<number>();
  const [remoteVideoTiles, setRemoteVideoTiles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
    }
    tog();
  }, [meetingStatus]);

  // UseEffect to set the remote video tile once remote attendee join with video already started.
  useEffect(() => {
    if (tiles && tiles.length) {
      setRemoteTileId(tiles[0]);
    } else {
      setRemoteTileId(undefined);
    }
  }, [tiles]);

  useEffect(() => {
    async function x(remoteTileId: number) {
      const start = () => {
        const remoteVideoTiles = [];
        for (let i=0;i<25;i++) {
          remoteVideoTiles.push(<div style={{height:'300px', width: '400px'}} key={i}>
          <RemoteVideo tileId={remoteTileId}/>
         </div>);
        }
        setRemoteVideoTiles(remoteVideoTiles);
      }
      for(let i=0;i<5;i++) {
        // Mount all 25 remote videos
        start();
        await new Promise(r => setTimeout(r, 10000));
        const stop = () => {
          setRemoteVideoTiles([]);
        }
        // Unmount all 25 remote videos
        stop();
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    if (remoteTileId) {
      x(remoteTileId);
    }
    
  }, [remoteTileId])

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const joinInfo = await fetch(`http://127.0.0.1:8080/join?meetingName=${meetingName}&attendeeName=${attendeeName}`, {method: 'POST'});
    const data = await joinInfo.json();
    const meetingSessionConfiguration = new MeetingSessionConfiguration(data.meeting.Meeting, data.attendee.Attendee);
    await meetingManager.join(meetingSessionConfiguration);
    await meetingManager.start();
  };

  const leaveMeeting = async () => {
    await meetingManager.leave();
  }

  const handleMeetingNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeetingName(e.target.value);
  }

  const handleAttendeeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAttendeeName(e.target.value);
  }

  return (
    <div className="Home">
      <div>
        Meeting name:
        <input type='text' value={meetingName} onChange={handleMeetingNameChange}></input>
      </div>
      <div>
        Attendee name:
        <input type='text' value={attendeeName} onChange={handleAttendeeNameChange}></input>
      </div>
      <button onClick={joinMeeting}>Join</button>
      <button onClick={leaveMeeting}>leave</button>
      <h3>Local Video</h3>
      <div style={{height:'300px', width: '400px'}}>
        <LocalVideo />
      </div>
      <h3>Remote Videos</h3>
      <div style={{display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gridTemplateColumns: 'repeat(5, 1fr)'}}>
        {remoteVideoTiles}
      </div>
    </div>
  );
}

export default Home;
