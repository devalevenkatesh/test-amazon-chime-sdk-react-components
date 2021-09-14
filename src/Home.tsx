import { useEffect } from 'react';

import { LocalVideo, useMeetingManager, useLocalVideo, useMeetingStatus, MeetingStatus } from 'amazon-chime-sdk-component-library-react';

function Home() {
  const mm = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  useEffect(() => {
    console.log("Meeting Status in Home useEffect", meetingStatus);
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
    }
    tog();
  }, [meetingStatus]);

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const joinInfo = await fetch('http://127.0.0.1:8080/join', {
      method: 'POST'
    });
    const data = await joinInfo.json();
    console.log('Received join info', data);
    const joinData = {
      meetingInfo: data.meeting.Meeting,
      attendeeInfo: data.attendee.Attendee,
    };
    await mm.join(joinData);
    await mm.start();
  };

  const leaveMeeting = async () => {
    await mm.leave();
  }

  return (
    <div className="Home">
      <button onClick={joinMeeting}>Join</button>
      <button onClick={leaveMeeting}>leave</button>
      <div style={{height:'300px', width: '400px'}}>
        <LocalVideo />
      </div>
    </div>
  );
}

export default Home;
