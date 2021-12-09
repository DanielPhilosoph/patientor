import { Patient, NewPatientType } from "../types";
import patients from "../data/patients";
import uniqId from "uniqid";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.filter((patient) => patient.id === id);
  if (patient.length === 0) {
    return undefined;
  } else {
    return patient[0];
  }
};

function getId(): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return `${uniqId()}`;
}

const addPatient = (patient: NewPatientType): Patient => {
  const uniqueId: string = getId();
  const newPatientObj = {
    id: uniqueId,
    ...patient,
  };

  patients.push(newPatientObj);
  return newPatientObj;
};

export default { getPatients, addPatient, getPatient };
