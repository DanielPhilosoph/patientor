import {
  NewDiaryEntry,
  Weather,
  Visibility,
  NewPatientType,
  Gender,
  Entry,
  Discharge,
  Diagnosis,
  HealthCheckRating,
  SickLeave,
} from "./types";

import uniqId from "uniqid";

import diagnoses from "./data/diagnoses";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewDiaryEntry = (object: any): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility),
  };

  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatientFunc = (object: any): NewPatientType => {
  const newPatient: NewPatientType = {
    name: parseName(object.name),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    entries: parseEntries(object.entries),
  };
  return newPatient;
};

function getId(): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return `${uniqId()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toEntry = (entry: any): Entry => {
  const type = parseType(entry.type);
  let newEntry: Entry;
  if (type === "Hospital") {
    const id: string = getId();
    newEntry = {
      id: id,
      date: parseDate(entry.date),
      type: type,
      specialist: parseSpecialist(entry.specialist),
      diagnosisCodes: parseDiagnoseCodes(entry.diagnosisCodes),
      description: parseComment(entry.description),
      discharge: parseDischarge(entry.discharge),
    };
  } else if (type === "HealthCheck") {
    const id: string = getId();
    newEntry = {
      id: id,
      date: parseDate(entry.date),
      type: type,
      specialist: parseSpecialist(entry.specialist),
      diagnosisCodes: parseDiagnoseCodes(entry.diagnosisCodes),
      description: parseComment(entry.description),
      healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
    };
  } else if (type === "OccupationalHealthcare") {
    const id: string = getId();
    newEntry = {
      id: id,
      date: parseDate(entry.date),
      type: type,
      specialist: parseSpecialist(entry.specialist),
      diagnosisCodes: parseDiagnoseCodes(entry.diagnosisCodes),
      description: parseComment(entry.description),
      employerName: parseEmployerName(entry.employerName),
      sickLeave: parseSickLeave(entry.sickLeave),
    };
  } else {
    throw new Error("Incorrect type");
  }
  return newEntry;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    isSickLeave(sickLeave) &&
    isDate(sickLeave.startDate) &&
    isDate(sickLeave.endDate)
  ) {
    return sickLeave;
  } else {
    throw new Error("Incorrect or missing sickLeave");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSickLeave(sickLeave: any): sickLeave is SickLeave {
  return (
    typeof sickLeave === "object" &&
    "startDate" in sickLeave &&
    "endDate" in sickLeave
  );
}

const parseEmployerName = (employerName: unknown): string => {
  if (isString(employerName)) {
    return employerName;
  } else {
    throw new Error("Incorrect or missing employerName");
  }
};

const parseHealthCheckRating = (checkRating: unknown): HealthCheckRating => {
  if (isHealthCheckRating(checkRating)) {
    return checkRating;
  } else {
    throw new Error("Incorrect or missing health check rating");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isHealthCheckRating(rating: any): rating is HealthCheckRating {
  return Object.values(HealthCheckRating).includes(rating);
}

const parseDischarge = (discharge: unknown): Discharge => {
  if (discharge && typeof discharge === "object") {
    if (isDischarge(discharge)) {
      if (
        isString(discharge.date) &&
        isDate(discharge.date) &&
        isString(discharge.criteria)
      ) {
        return discharge;
      } else {
        throw new Error("Incorrect or missing discharge");
      }
    } else {
      throw new Error("Incorrect or missing discharge");
    }
  } else {
    throw new Error("Incorrect or missing discharge");
  }
};

function isDischarge(discharge: any): discharge is Discharge {
  return "date" in discharge && "criteria" in discharge;
}

const parseType = (
  type: unknown
): "Hospital" | "OccupationalHealthcare" | "HealthCheck" => {
  if (
    type &&
    (type === "Hospital" ||
      type === "OccupationalHealthcare" ||
      type === "HealthCheck")
  ) {
    return type;
  } else {
    throw new Error("Incorrect or missing type");
  }
};

const parseDiagnoseCodes = (
  diagnosesArray: unknown
): Array<Diagnosis["code"]> => {
  if (isArrayOfDiagnosisCodes(diagnosesArray)) {
    return diagnosesArray;
  } else {
    throw new Error("Incorrect or missing diagnoses");
  }
};

function isArrayOfDiagnosisCodes(
  array: any
): array is Array<Diagnosis["code"]> {
  const diagnoseCodes: string[] = diagnoses.map((elem) => {
    return elem.code;
  });
  let flag = true;
  if (array && array instanceof Array && isArrayStringArray(array)) {
    array.forEach((element) => {
      const diagnoseCode = diagnoseCodes.find((code) => element === code);
      if (!diagnoseCode) {
        flag = false;
      }
    });
    return flag;
  } else {
    throw new Error("Incorrect or missing diagnoses");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const isArrayStringArray = (array: Array<any>): array is string[] => {
  let flag = true;
  array.forEach((element) => {
    if (!isString(element)) {
      flag = false;
    }
  });
  return flag;
};

const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error("Incorrect or missing comment");
  }

  return comment;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }

  return specialist;
};

// TEMP FUNCTION
const parseEntries = (entries: unknown): Entry[] => {
  return entries as Entry[];
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isWeather(weather)) {
    throw new Error("Incorrect or missing weather: " + weather);
  }
  return weather;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isWeather = (param: any): param is Weather => {
  return Object.values(Weather).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVisibility = (param: any): param is Visibility => {
  return Object.values(Visibility).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isVisibility(visibility)) {
    throw new Error("Incorrect or missing visibility: " + visibility);
  }
  return visibility;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

export default { toNewDiaryEntry, toNewPatientFunc, toEntry };
