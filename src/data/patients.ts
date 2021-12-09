import { Patient } from "../types";
import toNew from "../utils";

const data1 = [
  {
    id: 1,
    name: "Daniel",
    gender: "male",
    occupation: "Tel-mond",
    dateOfBirth: "1999-09-05",
    ssn: "YES",
    entries: [],
  },
  {
    id: 2,
    name: "Edan",
    gender: "male",
    occupation: "Tel-mond",
    dateOfBirth: "2001-08-19",
    ssn: "NO",
    entries: [],
  },
  {
    id: 3,
    name: "Michal",
    gender: "female",
    occupation: "Tel-mond",
    dateOfBirth: "2001-12-09",
    ssn: "NO",
    entries: [],
  },
];

const patients: Patient[] = data1.map((obj) => {
  const object = toNew.toNewPatientFunc(obj) as Patient;
  object.id = obj.id;
  return object;
});

export default patients;