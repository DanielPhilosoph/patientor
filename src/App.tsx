/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Patient } from "./types";

import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientListPage/PatientPage";

const App = () => {
  const [, dispatch] = useStateValue();
  const [patients, setPatients] = useState<Patient[]>([]);
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        setPatients(patientListFromApi);

        dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
  }, [dispatch]);

  const routes = patients.map((patient) => {
    const path = "/" + patient.id;
    return (
      <Route
        exact
        key={patient.id}
        path={path}
        ref={path}
        component={PatientPage}
      />
    );
  });
  console.log(routes);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patienter</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/">
              <PatientListPage />
            </Route>
            {routes}
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
