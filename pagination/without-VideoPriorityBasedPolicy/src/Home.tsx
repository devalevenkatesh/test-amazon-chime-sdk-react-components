import { 
  ChangeEvent,
  useEffect,
  useState
} from 'react';

import {
  LocalVideo,
  useMeetingManager,
  useLocalVideo,
  useMeetingStatus,
  MeetingStatus,
} from 'amazon-chime-sdk-component-library-react';
import { Pagination } from './Video';
import { LogLevel } from 'amazon-chime-sdk-js';

function Home() {
  const [meetingName, setMeetingName] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  useEffect(() => {
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
    }
    tog();
  }, [meetingStatus]);

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const joinInfo = await fetch(`http://127.0.0.1:8080/join?meetingName=${meetingName}&attendeeName=${attendeeName}`, {method: 'POST'});
    const data = await joinInfo.json();
    const joinData = {
      meetingInfo: data.meeting.Meeting,
      attendeeInfo: data.attendee.Attendee,
      meetingManagerConfig: {
        logLevel: LogLevel.INFO
      }
    };
    await meetingManager.join(joinData);
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
        <Pagination />
      </div>
    </div>
  );
}

export default Home;
