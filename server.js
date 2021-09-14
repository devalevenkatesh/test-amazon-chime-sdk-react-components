const http = require('http');
const AWS = require('aws-sdk');
const { v4: uuidV4 } = require('uuid');
const url = require('url');

const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer(async (req, res) => {
  const parsedURL = url.parse(req.url);
  if (req.method === 'POST' && parsedURL.pathname === '/join') {
    handleJoinRequest(res);
  }
});

const handleJoinRequest = async (res) => {
  const meetingName = 'test-amazon-chime-sdk-js';
  try {
    const meeting = await chime.createMeeting({
      ClientRequestToken: uuidV4(),
      ExternalMeetingId: meetingName,
    }).promise();
    console.log('CreateMeeting Success');
    meetingResponse = meeting;

    const attendee = await chime.createAttendee({
      MeetingId: meetingResponse.Meeting.MeetingId,
      ExternalUserId: 'venky-getting-started'
    }).promise();
    console.log('CreateAttendee Success');
    respond(res, 200, {meeting, attendee});
  } catch (error) {
    console.log('Error creating meeting or attendee', error);
    respond(res, 503, null);
  }
}

const respond = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(data));
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
