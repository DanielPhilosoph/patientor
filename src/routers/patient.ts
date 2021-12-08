import express from "express";
import patients from "../services/patientService";
import toNew from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patients.getPatients());
});

router.post("/", (req, res) => {
  try {
    const toNewPatient = toNew.toNewPatientFunc(req.body);

    const addedPatient = patients.addPatient(toNewPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;