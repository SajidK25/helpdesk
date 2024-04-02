/** @format */

// ticket detail page

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [responseText, setResponseText] = useState("");

 // to get ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/tickets/${ticketId}`
        );
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(`http://localhost:5001/api/tickets/${ticketId}`, {
        status,
      });
      // Refresh ticket details after updating status
      const response = await axios.get(
        `http://localhost:5001/api/tickets/${ticketId}`
      );
      setTicket(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleResponse = async () => {
    alert("Would normally send email here!");
    try {
      await axios.put(
        `http://localhost:5001/api/tickets/${ticketId}/response`,
        { response: responseText }
      );
      // Refresh ticket details after adding response
      const response = await axios.get(
        `http://localhost:5001/api/tickets/${ticketId}`
      );
      setTicket(response.data);
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="submit-form-container">
      <div className="submit-form-card ticket_details">
        <a href="http://localhost:3000" className="admin-link">Ticket Form</a> &nbsp;|&nbsp; 
        <a href="http://localhost:3000/admin" className="admin-link">Ticket List</a>
        <h2 className="text-uppercase">Ticket Detail</h2>
        <div className="row">
          <div className="ticket_data">
            <strong>Name:</strong>
          </div>
          <div className="ticket_data">{ticket.name}</div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <strong>Email:</strong>
          </div>
          <div className="ticket_data">{ticket.email}</div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <strong>Description:</strong>
          </div>
          <div className="ticket_data">{ticket.description}</div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <strong>Status:</strong>
          </div>
          <div className="ticket_data">{ticket.status}</div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <strong>Creation Date:</strong>{" "}
          </div>
          <div className="ticket_data">
            {new Date(ticket.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <h3 className="text-uppercase">Actions</h3>
          </div>
        </div>
        <div className="row">
          <div className="ticket_data">
            <label>Status:</label>
          </div>
          <div className="ticket_data">
            <select
              value={ticket.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
            >
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="ticket_response">
            <label>Response:</label>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div>
          <button onClick={handleResponse}>Update Ticket</button>
        </div>
      </div>
    </div>
  );
}


