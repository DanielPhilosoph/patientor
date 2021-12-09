import { Diagnose } from "../types";
import diagnoses from "../data/diagnoses";

const getDiagnoses = (): Diagnose[] => {
  return diagnoses.map((diagnose) => {
    if (diagnose.latin) {
      return {
        name: diagnose.name,
        code: diagnose.code,
        latin: diagnose.latin,
      };
    } else {
      return { name: diagnose.name, code: diagnose.code };
    }
  });
};

export default { getDiagnoses };
