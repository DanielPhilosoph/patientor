import { Patient } from "../types";

type pageType = {
  patient: Patient;
};

const PatientPage = (props: pageType) => {
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
    </div>
  );
};

export default PatientPage;
