import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AdminPanelPage } from './AdminPanelPage';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('AdminPanelPage', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should render ticket list after fetching tickets', async () => {
    const mockTickets = [
      { _id: '1', name: 'Christy Des', email: 'christy@gmail.com', status: 'new', createdAt: new Date().toISOString() },
      { _id: '2', name: 'chris de', email: 'chrisde@gmail.com', status: 'in progress', createdAt: new Date().toISOString() }
    ];

    mockAxios.onGet('http://localhost:5001/api/tickets').reply(200, mockTickets);

    const { getByText } = render(<AdminPanelPage />);

    await waitFor(() => {
      mockTickets.forEach(ticket => {
        expect(getByText(ticket.name)).toBeInTheDocument();
        expect(getByText(ticket.email)).toBeInTheDocument();
        expect(getByText(ticket.status)).toBeInTheDocument();
        expect(getByText(new Date(ticket.createdAt).toLocaleString())).toBeInTheDocument();
      });
    });
  });

  it('should display error message when tickets fails', async () => {
    mockAxios.onGet('http://localhost:5001/api/tickets').reply(500);

    const { getByText } = render(<AdminPanelPage />);

    await waitFor(() => {
      expect(getByText('Error fetching tickets:')).toBeInTheDocument();
    });
  });
});
