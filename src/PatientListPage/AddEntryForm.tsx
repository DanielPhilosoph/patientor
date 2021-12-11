//import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  SelectField,
  TypeOptions,
  //DiagnosisCodeOptions,
  NumberField,
  DiagnosisSelection,
} from "../AddPatientModal/FormField";
import {
  Diagnose,
  EntryTypes,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";
//import { parseDiagnoseCodes, parseName } from "../utils";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type DiagnosisFormValues = Omit<HospitalEntry, "id" | "type"> &
  Omit<HealthCheckEntry, "id" | "type"> &
  Omit<OccupationalHealthcareEntry, "id" | "type"> & {
    type: EntryTypes;
  };

interface Props {
  onSubmit: (values: DiagnosisFormValues) => void;

  diagnoses: Diagnose[];
}

const typeOptions: TypeOptions[] = [
  { value: EntryTypes.hospital, label: "Hospital" },
  { value: EntryTypes.healthCheck, label: "HealthCheck" },
  { value: EntryTypes.occupationalHealthcare, label: "OccupationalHealthcare" },
];

export const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
  //   const diagnosisCodes = (): DiagnosisCodeOptions[] => {
  //     if (diagnoses.length === 0) {
  //       return [{ value: "None", label: "None" }];
  //     }
  //     return diagnoses.map((diagnose) => {
  //       const code: string[] = parseDiagnoseCodes([diagnose.code]);
  //       const name: string = parseName(diagnose.name);
  //       const option: DiagnosisCodeOptions = {
  //         value: code[0],
  //         label: name,
  //       };
  //       return option;
  //     });
  //   };
  //const diagnosisCodesOptions = diagnosisCodes();

  return (
    <Formik
      initialValues={{
        type: EntryTypes.hospital,
        date: "",
        description: "",
        specialist: "",
        diagnosisCodes: undefined,
        discharge: {
          date: "",
          criteria: "",
        },
        healthCheckRating: 0,
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        const dateReg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        console.log(values);
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else if (!dateReg.test(values.date)) {
          errors.date = "Invalid date";
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.diagnosisCodes || values.diagnosisCodes.length === 0) {
          errors.diagnosisCodes = requiredError;
        }
        if (values.type === "Hospital") {
          if (!values.discharge.criteria) {
            errors["discharge.criteria"] = requiredError;
          }
          if (!values.discharge.date) {
            errors["discharge.date"] = requiredError;
          } else if (!dateReg.test(values.discharge.date)) {
            errors["discharge.date"] = "Invalid date";
          }
          if (!values.diagnosisCodes) {
            errors.diagnosisCodes = requiredError;
          }
        } else if (values.type === "OccupationalHealthcare") {
          if (!values.sickLeave || !values.sickLeave.startDate) {
            errors["sickLeave.startDate"] = requiredError;
          } else if (!dateReg.test(values.sickLeave.startDate)) {
            errors["sickLeave.startDate"] = "Invalid date";
          }
          if (!values.sickLeave || !values.sickLeave.endDate) {
            errors["discharge.endDate"] = requiredError;
          } else if (!dateReg.test(values.sickLeave.endDate)) {
            errors["sickLeave.endDate"] = "Invalid date";
          }
          if (!values.employerName) {
            errors.employName = requiredError;
          }
        } else if (values.type === "HealthCheck") {
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SelectField label="Entry type" name="type" options={typeOptions} />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Text.."
              name="description"
              component={TextField}
            />
            {/* <SelectField
              label="Diagnosis codes"
              name="diagnosisCodes"
              options={diagnosisCodesOptions}
            /> */}
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="*Hospital* discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />
            <Field
              label="*Hospital* discharge criteria"
              placeholder="Criteria..."
              name="discharge.criteria"
              component={TextField}
            />
            <Field
              label="*Occupational Healthcare* Employer name"
              placeholder="Name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="*Occupational Healthcare* Sick leave - start date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="*Occupational Healthcare* Sick leave - end date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />
            <Field
              label="*Health check* Health check rating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
            />

            <Grid>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
