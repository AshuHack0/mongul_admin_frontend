# Video Chat Rooms

This is a simple 1v1 video chat feature integrated into the Mongul Admin Frontend.

## How to Use

### Creating a Room
1. Navigate to `/rooms` in the admin panel
2. Click "Create Room" button
3. A unique room ID will be generated
4. Share the room link with someone you want to video chat with

### Joining a Room
1. Navigate to `/rooms` in the admin panel
2. Click "Join Room" button
3. Enter the room ID provided by the room creator
4. Click "Join Room" to start the video call

### Features
- **1v1 Video Calls**: Only two people can join a room at a time
- **Room Sharing**: Copy the room link to share with others
- **Video/Audio Controls**: Toggle your camera and microphone on/off
- **Automatic Connection**: When someone joins with the same room ID, the video call starts automatically

### Technical Details
- Uses WebRTC for peer-to-peer video communication
- Socket.IO for signaling (room management, connection setup)
- STUN servers for NAT traversal
- Works in modern browsers with camera/microphone permissions

### URL Structure
- Room URLs follow the pattern: `http://your-domain/rooms?room=ROOM_ID`
- Example: `http://localhost:3000/rooms?room=ABC123`

### Browser Requirements
- Modern browser with WebRTC support
- Camera and microphone permissions
- HTTPS required for production (camera access)

### Troubleshooting
- If video doesn't work, check browser permissions
- Make sure both users are using the same room ID
- Check that the backend WebRTC server is running on port 8086 