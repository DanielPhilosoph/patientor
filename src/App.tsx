/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientLis } from "./state";
import { Diagnose, Patient } from "./types";

import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientListPage/PatientPage";

const App = () => {
  const [, dispatch] = useStateValue();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiagnoses = async () => {
      try {
        const { data: dataFromDiagnosesApi } = await axios.get<Diagnose[]>(
          `${apiBaseUrl}/diagnoses`
        );
        setDiagnoses(dataFromDiagnosesApi);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        setPatients(patientListFromApi);
        dispatch(setPatientLis(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
    void fetchDiagnoses();
  }, [dispatch]);

  const routes = patients.map((patient) => {
    const path = "/" + patient.id;
    return (
      <Route
        key={patient.id}
        path={path}
        element={
          <PatientPage
            patient={patient}
            diagnoses={diagnoses}
            setPatients={setPatients}
            patients={patients}
            dispatch={dispatch}
          />
        }
      />
    );
  });

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patienter</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            {routes}
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
