/** @format */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware

// Connect to MongoDB
mongoose.connect("mongodb+srv://sajid:sAax4VB5sYRCf4bz@cluster0.zppd3.mongodb.net/helpdesk?retryWrites=true&w=majority&appName=Cluster0&directConnection=true",
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define ticket schema
const ticketSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  status: {
    type: String,
    enum: ["new", "in progress", "resolved"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// API endpoints to create ticket
app.post("/api/tickets", async (req, res) => {
  try {
    const { name, email, description } = req.body;
    const ticket = new Ticket({ name, email, description });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tickets
app.get("/api/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ticket by ID
app.get("/api/tickets/:id", getTicket, (req, res) => {
  res.json(res.ticket);
});

// Middleware to get ticket by ID
async function getTicket(req, res, next) {
  let ticket;
  try {
    ticket = await Ticket.findById(req.params.id);
    if (ticket == null) {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.ticket = ticket;
  next();
}

// Update ticket status
app.put("/api/tickets/:id", getTicket, async (req, res) => {
  try {
    res.ticket.status = req.body.status;
    await res.ticket.save();
    res.json(res.ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
