import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Paper } from "@mui/material";

// Message page for both employee and employer dashboards
const MessagesPage = ({ isEmployer = false }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    // Fetch all conversations where user is sender or receiver
    const q = query(
      collection(db, "messages"),
      where(isEmployer ? "receiverId" : "senderId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      // Group by conversationId (jobId + otherUserId)
      const convMap = {};
      snap.forEach(doc => {
        const data = doc.data();
        const otherId = isEmployer ? data.senderId : data.receiverId;
        const convId = data.jobId + "_" + otherId;
        if (!convMap[convId]) {
          convMap[convId] = {
            jobId: data.jobId,
            otherId,
            lastMessage: data.content,
            lastTimestamp: data.timestamp,
            messages: [],
          };
        }
        convMap[convId].messages.push({ ...data, id: doc.id });
        // Update last message if newer
        if (!convMap[convId].lastTimestamp || (data.timestamp && data.timestamp > convMap[convId].lastTimestamp)) {
          convMap[convId].lastMessage = data.content;
          convMap[convId].lastTimestamp = data.timestamp;
        }
      });
      setConversations(Object.values(convMap).sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0)));
      setLoading(false);
    });
    return () => unsub();
  }, [isEmployer]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConv) return;
    const q = query(
      collection(db, "messages"),
      where("jobId", "==", selectedConv.jobId),
      where(isEmployer ? "senderId" : "receiverId", "==", selectedConv.otherId),
      where(isEmployer ? "receiverId" : "senderId", "==", auth.currentUser.uid),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [selectedConv, isEmployer]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    await addDoc(collection(db, "messages"), {
      jobId: selectedConv.jobId,
      senderId: auth.currentUser.uid,
      receiverId: selectedConv.otherId,
      content: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <Box sx={{ display: "flex", height: "80vh", bgcolor: "#f5f5f5" }}>
      <Paper sx={{ width: 300, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ p: 2 }}>Conversations</Typography>
        <List>
          {loading ? <ListItem><ListItemText primary="Loading..." /></ListItem> :
            conversations.length === 0 ? <ListItem><ListItemText primary="No conversations" /></ListItem> :
              conversations.map((conv, idx) => (
                <ListItem button key={idx} selected={selectedConv === conv} onClick={() => setSelectedConv(conv)}>
                  <ListItemText
                    primary={`Job: ${conv.jobId}`}
                    secondary={conv.lastMessage}
                  />
                </ListItem>
              ))}
        </List>
      </Paper>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {selectedConv ? (
            messages.length === 0 ? <Typography>No messages yet.</Typography> :
              messages.map(msg => (
                <Box key={msg.id} sx={{ mb: 2, textAlign: msg.senderId === auth.currentUser.uid ? "right" : "left" }}>
                  <Paper sx={{ display: "inline-block", p: 1.5, bgcolor: msg.senderId === auth.currentUser.uid ? "#e0f7fa" : "#fff" }}>
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" color="text.secondary">{msg.timestamp?.toDate?.().toLocaleString?.() || ""}</Typography>
                  </Paper>
                </Box>
              ))
          ) : <Typography sx={{ p: 2 }}>Select a conversation to view messages.</Typography>}
        </Box>
        {selectedConv && (
          <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #e0e0e0" }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} variant="contained" sx={{ ml: 2 }}>Send</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessagesPage;
