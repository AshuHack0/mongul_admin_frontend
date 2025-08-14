import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import io from 'socket.io-client';

const Rooms = () => {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallNotification, setShowCallNotification] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'incoming', 'accepted', 'rejected'
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  useEffect(() => {
    // Only generate userId once on component mount
    if (!userId) {
      const newUserId = `user-${Math.floor(Math.random() * 10000)}`;
      setUserId(newUserId);
      console.log('Generated new user ID:', newUserId);
    }
    
    // Check URL for room ID
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl && !isConnected) {
      setRoomId(roomFromUrl);
      joinRoom(roomFromUrl, false); // false = not the creator
    }
  }, []);

  // Handle remote stream assignment
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('Remote stream assigned to video element');
    }
  }, [remoteStream]);

  // Auto-determine creator based on participants list
  useEffect(() => {
    if (participants.length > 0 && userId) {
      const firstUser = participants[0];
      const isFirstUser = firstUser === userId;
      if (isFirstUser !== isRoomCreator) {
        console.log(`Auto-setting creator status: ${isFirstUser ? 'Yes' : 'No'} (user ${userId} is ${isFirstUser ? 'first' : 'not first'} in participants list)`);
        setIsRoomCreator(isFirstUser);
        
        // If this user is now the creator and there are other participants, show call notification
        if (isFirstUser && participants.length > 1) {
          const otherUser = participants.find(p => p !== userId);
          if (otherUser && !incomingCall) {
            console.log('Auto-showing call notification for creator');
            setIncomingCall({
              userId: otherUser,
              roomId: roomId
            });
            setCallStatus('incoming');
            setShowCallNotification(true);
          }
        }
      }
    }
  }, [participants, userId, isRoomCreator, incomingCall, roomId]);

  const initializeSocket = () => {
    const socketInstance = io('http://localhost:8086/webrtc');
    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to server');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('user-connected', async (newUserId) => {
      console.log('=== USER CONNECTED EVENT ===');
      console.log('New user ID:', newUserId);
      console.log('Current user ID:', userId);
      console.log('Is room creator:', isRoomCreator);
      console.log('Current participants before update:', participants);
      console.log('Room ID:', roomId);
      
      // Add the new user to participants list (if not already there)
      setParticipants(prev => {
        if (!prev.includes(newUserId)) {
          const newParticipants = [...prev, newUserId];
          console.log('Updated participants:', newParticipants);
          return newParticipants;
        } else {
          console.log('User already in participants list');
          return prev;
        }
      });
      
      // Only show incoming call notification if this user is the room creator
      if (newUserId !== userId && isRoomCreator) {
        console.log('Showing incoming call notification to room creator');
        setIncomingCall({
          userId: newUserId,
          roomId: roomId
        });
        setCallStatus('incoming');
        setShowCallNotification(true);
      } else if (newUserId !== userId && !isRoomCreator) {
        console.log('Non-creator user joined, waiting for creator to accept');
      } else {
        console.log('This is the current user, no need to create peer connection');
      }
    });

    socketInstance.on('offer', async (data) => {
      console.log('=== RECEIVED OFFER ===');
      console.log('Offer data:', data);
      console.log('Current user ID:', userId);
      console.log('Offer from user ID:', data.userId);
      
      if (data.userId !== userId) {
        console.log('Processing offer from different user');
        createPeerConnection();
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          console.log('Remote description set successfully');
          
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          console.log('Local description set, sending answer');
          
          socketInstance.emit('answer', answer, roomId);
          console.log('Answer sent successfully');
        } catch (err) {
          console.error('Failed to handle offer:', err);
          setError('Failed to handle connection');
        }
      } else {
        console.log('Ignoring offer from self');
      }
    });

    socketInstance.on('answer', async (data) => {
      console.log('=== RECEIVED ANSWER ===');
      console.log('Answer data:', data);
      console.log('Current user ID:', userId);
      console.log('Answer from user ID:', data.userId);
      
      if (data.userId !== userId) {
        console.log('Processing answer from different user');
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('Remote description set from answer');
        } catch (err) {
          console.error('Failed to handle answer:', err);
          setError('Failed to handle connection');
        }
      } else {
        console.log('Ignoring answer from self');
      }
    });

    socketInstance.on('ice-candidate', async (data) => {
      if (data.userId !== userId && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('ICE candidate error:', err);
        }
      }
    });

    socketInstance.on('user-disconnected', (disconnectedUserId) => {
      console.log('User disconnected:', disconnectedUserId);
      
      // Remove the disconnected user from participants list
      setParticipants(prev => prev.filter(id => id !== disconnectedUserId));
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        setRemoteStream(null);
      }
      
      // Reset call status if the disconnected user was in a call
      if (incomingCall?.userId === disconnectedUserId) {
        setIncomingCall(null);
        setShowCallNotification(false);
        setCallStatus('idle');
      }
    });

    // Handle call rejection
    socketInstance.on('call-rejected', (rejectedByUserId) => {
      console.log('Call was rejected by:', rejectedByUserId);
      setError('Call was rejected by the room creator');
      setCallStatus('idle');
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    setSocket(socketInstance);
    return socketInstance;
  };

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    const peerConnection = new RTCPeerConnection(iceServers);
    console.log('=== CREATING PEER CONNECTION ===');
    
    if (localStream) {
      console.log('Adding local stream tracks to peer connection');
      localStream.getTracks().forEach(track => {
        console.log('Adding track:', track.kind, track.id);
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.warn('No local stream available for peer connection');
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Get the current socket reference to avoid closure issues
        const currentSocket = socket;
        if (currentSocket && currentSocket.connected) {
          currentSocket.emit("ice-candidate", event.candidate, roomId);
        } else {
          console.warn('Socket not available for ICE candidate');
        }
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('=== ONTRACK EVENT ===');
      console.log('Event streams:', event.streams);
      console.log('Event track:', event.track);
      console.log('Setting remote stream:', event.streams[0]);
      setRemoteStream(event.streams[0]);
      setCallStatus('connected'); // Update status when stream is received
      console.log('Call status updated to: connected');
    };

    peerConnectionRef.current = peerConnection;
  };

  const startLocalStream = async () => {
    try {
      setLoading(true);
      console.log('=== STARTING LOCAL STREAM ===');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      console.log('Local stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Local stream assigned to video element');
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to access camera/microphone:', err);
      setError('Failed to access camera/microphone');
      setLoading(false);
    }
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setShowCreateRoom(false);
    setIsRoomCreator(true);
    await joinRoom(newRoomId, true); // true = is creator
  };

  const joinRoom = async (roomToJoin = roomId, isCreator = false) => {
    if (!roomToJoin.trim()) {
      setError('Please enter a room ID');
      return;
    }

    try {
      setLoading(true);
      
      // Initialize socket if not already done
      let currentSocket = socket;
      if (!currentSocket) {
        currentSocket = initializeSocket();
      }

      // Wait for socket to connect
      if (!currentSocket.connected) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Socket connection timeout'));
          }, 5000);

          currentSocket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
          });

          currentSocket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });
      }

      // Start local stream
      await startLocalStream();
      
      // Join the room
      console.log('=== JOINING ROOM ===');
      console.log('Room ID:', roomToJoin);
      console.log('User ID:', userId);
      console.log('Is Creator:', isCreator);
      console.log('Socket connected:', currentSocket.connected);
      currentSocket.emit('join-room', roomToJoin, userId);
      setRoomId(roomToJoin);
      setIsRoomCreator(isCreator);
      
      // Add current user to participants list
      console.log('Adding current user to participants:', userId);
      setParticipants([userId]);
      
      // Set connected state to true since we've successfully joined
      setIsConnected(true);
      
      // Update URL
      const newUrl = `${window.location.origin}${window.location.pathname}?room=${roomToJoin}`;
      window.history.pushState({}, '', newUrl);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError(err.message || 'Failed to join room');
      setLoading(false);
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave-room', roomId, userId);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setRoomId('');
    setParticipants([]);
    setCallStatus('idle');
    setIncomingCall(null);
    setShowCallNotification(false);
    setIsRoomCreator(false);
    setIsConnected(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(roomLink);
    alert('Room link copied to clipboard!');
  };

  // Helper function to safely emit socket events
  const safeEmit = (event, ...args) => {
    const currentSocket = socket;
    if (currentSocket && currentSocket.connected) {
      currentSocket.emit(event, ...args);
      return true;
    } else {
      console.warn(`Socket not available for event: ${event}`);
      return false;
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      console.log('Room creator accepting call from:', incomingCall.userId);
      setCallStatus('accepted');
      setShowCallNotification(false);
      
      // Start the video call
      createPeerConnection();
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      if (!safeEmit('offer', offer, roomId)) {
        setError('Connection lost. Please refresh the page.');
        return;
      }
      
      setIncomingCall(null);
    } catch (err) {
      console.error('Failed to accept call:', err);
      setError('Failed to accept call');
    }
  };

  const rejectCall = () => {
    console.log('Room creator rejecting call from:', incomingCall?.userId);
    setCallStatus('rejected');
    setShowCallNotification(false);
    setIncomingCall(null);
    
    // Notify the other user that call was rejected
    if (incomingCall) {
      safeEmit('call-rejected', incomingCall.userId, roomId);
    }
  };

  if (!isConnected) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Video Chat
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Connection Status: {socket ? (socket.connected ? 'Connected' : 'Disconnected') : 'Not Initialized'}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowCreateRoom(true)}
            sx={{ mr: 2 }}
          >
            Create Room
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setShowCreateRoom(false)}
          >
            Join Room
          </Button>
        </Box>

        {showCreateRoom ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create New Room
            </Typography>
            <Button variant="contained" onClick={createRoom}>
              Generate Room ID
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Join Room
            </Typography>
            <TextField
              fullWidth
              label="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => joinRoom()}
              disabled={loading || !roomId.trim()}
            >
              {loading ? <CircularProgress size={20} /> : 'Join Room'}
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Room: {roomId}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={copyRoomLink}>
          Copy Link
        </Button>
        <Button variant="outlined" onClick={toggleVideo}>
          {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </Button>
        <Button variant="outlined" onClick={toggleAudio}>
          {isAudioEnabled ? 'Turn Off Audio' : 'Turn On Audio'}
        </Button>
        <Button variant="outlined" color="error" onClick={leaveRoom}>
          Leave Room
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => {
            console.log('=== DEBUG INFO ===');
            console.log('Local Stream:', localStream);
            console.log('Remote Stream:', remoteStream);
            console.log('Peer Connection:', peerConnectionRef.current);
            console.log('Local Video Ref:', localVideoRef.current);
            console.log('Remote Video Ref:', remoteVideoRef.current);
            console.log('Socket:', socket);
            console.log('Call Status:', callStatus);
            console.log('Incoming Call:', incomingCall);
          }}
        >
          Debug
        </Button>
      </Box>

      {/* Manual Start Video Call Button - for debugging */}
      {participants.length === 2 && !remoteStream && callStatus === 'idle' && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isRoomCreator ? 'Click to start video call with the other participant' : 'Waiting for creator to start video call'}
          </Typography>
          {isRoomCreator && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={async () => {
                try {
                  console.log('Manually starting video call');
                  setCallStatus('connecting'); // Update status immediately
                  createPeerConnection();
                  const offer = await peerConnectionRef.current.createOffer();
                  await peerConnectionRef.current.setLocalDescription(offer);
                  
                  if (!safeEmit('offer', offer, roomId)) {
                    setError('Connection lost. Please refresh the page.');
                    setCallStatus('idle'); // Reset on error
                    return;
                  }
                  
                  console.log('Offer sent successfully');
                } catch (err) {
                  console.error('Failed to start video call:', err);
                  setError('Failed to start video call');
                  setCallStatus('idle'); // Reset on error
                }
              }}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Video Call
            </Button>
          )}
        </Box>
      )}

      {/* Show connecting status */}
      {callStatus === 'connecting' && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Connecting video call...
          </Typography>
        </Box>
      )}

      {/* Participants Display */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Participants ({participants.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {participants.map((participant, index) => (
            <Box
              key={index}
              sx={{
                px: 2,
                py: 1,
                bgcolor: participant === userId ? 'primary.main' : 'secondary.main',
                color: 'white',
                borderRadius: 1,
                fontSize: '0.875rem'
              }}
            >
              {participant} {participant === userId ? '(You)' : ''}
            </Box>
          ))}
        </Box>
        
        {/* Debug Info */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Debug: User ID: {userId} | Room: {roomId} | Creator: {isRoomCreator ? 'Yes' : 'No'} | Connected: {isConnected ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Local Stream: {localStream ? 'Active' : 'None'} | Remote Stream: {remoteStream ? 'Active' : 'None'} | Peer Connection: {peerConnectionRef.current ? 'Active' : 'None'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Call Status: {callStatus} | Incoming Call: {incomingCall ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Participants: {participants.join(', ')} | First User: {participants[0] || 'None'}
          </Typography>
        </Box>

        {/* Call Notification Dialog - Only for room creator */}
        <Dialog 
          open={showCallNotification && isRoomCreator} 
          onClose={rejectCall}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Incoming Video Call
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {incomingCall?.userId} wants to start a video call
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Room: {incomingCall?.roomId}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              onClick={rejectCall} 
              variant="outlined" 
              color="error"
              sx={{ mr: 2 }}
            >
              Decline
            </Button>
            <Button 
              onClick={acceptCall} 
              variant="contained" 
              color="primary"
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>You</Typography>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '300px',
              height: '225px',
              background: '#2c3e50',
              borderRadius: '8px'
            }}
          />
        </Box>

        {remoteStream && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Remote User</Typography>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '300px',
                height: '225px',
                background: '#2c3e50',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
      </Box>

      {!remoteStream && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {isRoomCreator 
              ? 'Waiting for someone to join the room...' 
              : 'Waiting for room creator to accept the call...'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Share the room link: {`${window.location.origin}${window.location.pathname}?room=${roomId}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Rooms; 