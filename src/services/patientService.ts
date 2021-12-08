import { Patient, NewPatientType } from "../types";
import patients from "../../data/patients";

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = (patient: NewPatientType): Patient => {
  const newPatientObj = {
    id: Math.max(...patients.map((d) => d.id)) + 1,
    ...patient,
  };

  patients.push(newPatientObj);
  return newPatientObj;
};

export default { getPatients, addPatient };
