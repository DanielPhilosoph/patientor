import { Patient, NewPatientType } from "../types";
import patients from "../data/patients";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: number): Patient | undefined => {
  const patient = patients.filter((patient) => patient.id === id);
  if (patient.length === 0) {
    return undefined;
  } else {
    console.log(patients);

    return patient[0];
  }
};

const addPatient = (patient: NewPatientType): Patient => {
  const newPatientObj = {
    id: Math.max(...patients.map((d) => d.id)) + 1,
    ...patient,
  };

  patients.push(newPatientObj);
  return newPatientObj;
};

export default { getPatients, addPatient, getPatient };
