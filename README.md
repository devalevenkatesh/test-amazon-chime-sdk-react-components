# Setup steps

This is a very basic app built using [`amazon-chime-sdk-component-library-react`](https://github.com/aws/amazon-chime-sdk-component-library-react).

Note: This app is generated using `npx create-react-app --use-npm --template typescript`.

## Steps to run the app
To run the app:
1. Clone the repo.
```
git clone https://github.com/devalevenkatesh/test-amazon-chime-sdk-react-components.git
```

2. Change directory into the repo cloned directory.
```
cd test-amazon-chime-sdk-react-components
```

3. Install node-modules.
```
npm install
```

4. Export your AWS credentials to the current session in local terminal.
```
export AWS_ACCESS_KEY_ID=<access-key-id>
export AWS_SECRET_ACCESS_KEY=<secret-access-key>
```

5. Run the local node server to get the `CreateMeeting` and `CreateAttendee` API responses:
```
node server.js
```

6. Run the web application:
```
npm run start
```

## What does the app show?
This app shows how you can enable your local video as soon as the meeting session starts.
You will see two buttons in a UI side by side, join and leave and the local and remote video will appear one below the other.

- On clicking join button, we create the meeting and attendee and start the meeting session, also the local video should now come up automatically.
- Included the `LocalVideo` component and used `toggleVideo` function from `useLocalVideo()` hook to start as soon as the meeting session status goes to "succeeded".
- On clicking leave button, we leave the meeting session.
- Included `RemoteVideo` component to show remote video tile when an remote attendee joins the same meeting with video enabled.
