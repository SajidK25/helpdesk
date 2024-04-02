/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SubmitTicketForm } from "./Component/SubmitTicketForm";
import { AdminPanelPage } from "./Component/AdminPanelPage";
import { TicketDetailPage } from "./Component/TicketDetailPage";

function App() {
  
  return (
    <Router>
      <Switch>
        <Route exact path="/admin" component={AdminPanelPage} />
        <Route exact path="/ticket/:ticketId" component={TicketDetailPage} />
        <Route exact path="/">
          <SubmitTicketForm /> 
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
