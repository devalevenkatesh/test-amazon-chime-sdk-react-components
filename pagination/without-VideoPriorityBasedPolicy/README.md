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

3. Change directory into the demo specific directory.
```
cd pagination/without-VideoPriorityBasedPolicy
```

4. Install node-modules.
```
npm install
```

5. Export your AWS credentials to the current session in local terminal.
```
export AWS_ACCESS_KEY_ID=<access-key-id>
export AWS_SECRET_ACCESS_KEY=<secret-access-key>
```

6. Run the local node server to get the `CreateMeeting` and `CreateAttendee` API responses:
```
node server.js
```

7. Run the web application:
```
npm run start
```

## Without VideoPriorityBasedPolicy

This app shows pagination implementation with `RemoteVideo` component where users join the meeting and video is enable on meeting join.