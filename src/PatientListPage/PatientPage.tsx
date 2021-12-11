// import { Button } from "semantic-ui-react";
import axios, { AxiosError } from "axios";

import { Dispatch, SetStateAction } from "react";
import { apiBaseUrl } from "../constants";
import diagnoses from "../data/diagnoses";
import { Action, setPatientLis } from "../state";

import {
  Diagnose,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../types";
import { parseDischarge } from "../utils";
import AddEntryForm, { DiagnosisFormValues } from "./AddEntryForm";

type pageType = {
  patient: Patient;
  diagnoses: Diagnose[];
  setPatients: Dispatch<SetStateAction<Patient[]>>;
  patients: Patient[];
  dispatch: React.Dispatch<Action>;
};

const PatientPage = (props: pageType) => {
  const submitEntry = async (values: DiagnosisFormValues) => {
    let entryObj:
      | Omit<HospitalEntry, "id">
      | Omit<HealthCheckEntry, "id">
      | Omit<OccupationalHealthcareEntry, "id">;
    switch (values.type) {
      case "Hospital":
        entryObj = {
          type: "Hospital",
          date: values.date,
          description: values.description,
          diagnosisCodes: values.diagnosisCodes,
          specialist: values.specialist,
          discharge: parseDischarge(values.discharge),
        };
        console.log("Obj before sending: ");
        console.log(entryObj);

        break;
      case "HealthCheck":
        entryObj = {
          type: "HealthCheck",
          date: values.date,
          description: values.description,
          diagnosisCodes: values.diagnosisCodes,
          specialist: values.specialist,
          healthCheckRating: values.healthCheckRating,
        };
        break;
      case "OccupationalHealthcare":
        entryObj = {
          type: "OccupationalHealthcare",
          date: values.date,
          description: values.description,
          diagnosisCodes: values.diagnosisCodes,
          specialist: values.specialist,
          employerName: values.employerName,
          sickLeave: values.sickLeave,
        };
        break;
      default:
        throw new Error("Something went wrong");
    }
    try {
      await axios.post<Entry>(
        `${apiBaseUrl}/patients/${props.patient.id}/entries`,
        entryObj
      );
      const { data: patientListFromApi } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
      );
      props.setPatients(patientListFromApi);
      props.dispatch(setPatientLis(patientListFromApi));
    } catch (e) {
      const err = e as AxiosError;
      if (err.response) {
        console.error(err.response?.data || "Unknown Error");
      }
    }
  };

  let entries: JSX.Element | JSX.Element[];
  if (
    props.patient.entries?.length === 0 ||
    props.patient.entries === undefined
  ) {
    entries = <span></span>;
  } else {
    entries = props.patient.entries?.map((entry) => {
      const diagnosisCodes = entry.diagnosisCodes?.map((diagnose, i) => {
        const diagnoseName = props.diagnoses.find(
          (diagnoseD) => diagnoseD.code === diagnose
        );
        return (
          <p key={i}>
            <i>
              {diagnose} {diagnoseName ? diagnoseName.name : ""}
            </i>
          </p>
        );
      });
      switch (entry.type) {
        case "Hospital":
          return (
            <div key={entry.id}>
              <h3>Hospital</h3>
              <p>
                {entry.date} {entry.description}
              </p>
              <ul>{diagnosisCodes}</ul>
              <p>Specialist: {entry.specialist}</p>
              <p>
                Discharge at {entry.discharge.date}: {entry.discharge.criteria}
              </p>
              <br />
            </div>
          );
        case "HealthCheck":
          return (
            <div key={entry.id}>
              <h3>Health Check</h3>
              <p>
                {entry.date} {entry.description}
              </p>
              <ul>{diagnosisCodes}</ul>
              <p>Specialist: {entry.specialist}</p>
              <p>Health Rating: {entry.healthCheckRating}</p>
              <br />
            </div>
          );
        case "OccupationalHealthcare":
          // If has sickLeave, enter data
          const leave = entry.sickLeave
            ? `Started on ${entry.sickLeave.startDate} and done on
              ${entry.sickLeave.endDate}`
            : "";
          return (
            <div key={entry.id}>
              <h3>Occupational Health care</h3>
              <p>
                {entry.date} {entry.description}
              </p>
              <ol>{diagnosisCodes}</ol>
              <p>Specialist: {entry.specialist}</p>
              <p>Employer name: {entry.employerName}</p>
              <p>{leave}</p>
              <br />
            </div>
          );
      }
    });
  }

  const symbol =
    props.patient.gender === "male" ? (
      <i className="fas fa-mars"></i>
    ) : (
      <i className="fas fa-venus"></i>
    );
  return (
    <div>
      <h1>
        {props.patient.name} {symbol}
      </h1>
      <br />
      <h4>ssn: {props.patient.ssn}</h4>
      <h4>occupation: {props.patient.occupation}</h4>
      <h1>Entries</h1>
      <h4>{entries}</h4>
      <br />
      <AddEntryForm
        //modalOpen={modalOpen}
        onSubmit={submitEntry}
        //error={error}
        diagnoses={diagnoses}
      />
    </div>
  );
};

export default PatientPage;
