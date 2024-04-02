/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles.css";

//submit ticket form

export const SubmitTicketForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [tickets, setTickets] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ticket refresh upon submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/tickets", formData);
      setSubmitMessage("Ticket submitted successfully!");
      setFormData({ name: "", email: "", description: "" });
      fetchTickets(); 
    } catch (err) {
      setSubmitMessage("Error submitting ticket! Try again.");
    }
  };

  return (
    <div className="submit-form-container">
      <div className="submit-form-card">
        <a href="http://localhost:3000/admin" className="admin-link">Ticket Admin</a>
        <h2 className="text-uppercase">Submit Support Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="fields">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fields">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fields">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              placeholder="Provide Description Of Your Ticket"
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit">Submit Ticket</button>
          {submitMessage && (
            <div className={`msg ${submitMessage.includes("successfully") ? "success" : "failed"}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
