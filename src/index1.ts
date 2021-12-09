import express from "express";
import diaryRouter from "./routers/diaries";
import diagnosesRouter from "./routers/diagnoses";
import patientsRouter from "./routers/patient";

const app = express();
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.use("/api/diagnoses", diagnosesRouter);

app.use("/api/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
