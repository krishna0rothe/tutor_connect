const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Parent = require("../models/Parent"); 
const Teacher = require("../models/Teacher");

exports.sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;
  const { role, id } = req.user; // Extracting role and ID from middleware

  try {
    // Validate input
    if (!conversationId || !content) {
      return res
        .status(400)
        .json({ status: "failed", message: "Conversation ID and message content are required" });
    }

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ status: "failed", message: "Conversation not found" });
    }

    // Check if the user is a participant in the conversation
    const userIndex = conversation.participants.findIndex(
      (participant) => participant.toString() === id
    );
    if (userIndex === -1) {
      return res
        .status(403)
        .json({ status: "failed", message: "You are not a participant in this conversation" });
    }

    // Determine the sender model
    const senderModel = role === "parent" ? "Parent" : "Teacher";

    // Create the message
    const newMessage = new Message({
      conversation: conversationId,
      sender: id,
      senderModel,
      content,
    });

    await newMessage.save();

    // Add the message ID to the conversation's messages array
    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id; // Update last message
    conversation.lastMessageTime = new Date(); // Update last message time
    await conversation.save();

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while sending the message",
      error: error.message,
    });
  }
};

exports.getOrCreateConversation = async (req, res) => {
  const recipientId = req.query.recipientId; // ID of the other participant (teacher/parent)
  const { id: userId, role } = req.user; // Extract authenticated user ID and role

  try {
    // Validate input
    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    let sender, recipient, senderModel, recipientModel;
    console.log(role);

    // Determine sender and recipient based on role
    if (role === "parent") {
      // Parent is the sender, Teacher is the recipient
      sender = await Parent.findById(userId).select("name");
      recipient = await Teacher.findById(recipientId).select("name");
      senderModel = "Parent";
      recipientModel = "Teacher";

      if (!sender) return res.status(404).json({ message: "Parent not found" });
      if (!recipient)
        return res.status(404).json({ message: "Teacher not found" });
    } else if (role === "teacher") {
      // Teacher is the sender, Parent is the recipient
      sender = await Teacher.findById(userId).select("name");
      recipient = await Parent.findById(recipientId).select("name");
      senderModel = "Teacher";
      recipientModel = "Parent";

      if (!sender)
        return res.status(404).json({ message: "Teacher not found" });
      if (!recipient)
        return res.status(404).json({ message: "Parent not found" });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized role for starting a conversation" });
    }

    // Check if a conversation already exists between the participants
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        participants: [userId, recipientId],
        participantsModel: [senderModel, recipientModel],
      });

      await conversation.save();
    }

    // Fetch all messages for the conversation
    const messages = await Message.find({ conversation: conversation._id })
      .sort({ sentTime: 1 }) // Sort messages in chronological order
      .select("content sender senderModel sentTime"); // Select relevant fields only

    // Prepare the response
    const response = {
      conversation: {
        _id: conversation._id,
        participants: [
          { id: sender._id, name: sender.name, role: senderModel },
          { id: recipient._id, name: recipient.name, role: recipientModel },
        ],
      },
      totalMessages: messages.length,
      messages: messages.map((msg) => ({
        _id: msg._id,
        content: msg.content,
        sender: msg.sender,
        senderModel: msg.senderModel,
        sentTime: msg.sentTime,
      })),
    };

    res.status(200).json({
      status: "success",
      message: "Conversation retrieved successfully",
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while processing the conversation",
      error: error.message,
    });
  }
};


