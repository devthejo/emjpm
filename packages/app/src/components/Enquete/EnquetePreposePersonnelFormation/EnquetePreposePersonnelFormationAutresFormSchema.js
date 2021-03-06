import yup from "../../../lib/validationSchemas/yup";

// schema identique à enquetePreposePersonnelFormationStatus
export const enquetePreposePersonnelFormationAutresFormSchema = yup
  .object()
  .shape({
    nb_autre_personnel: yup.number().integer().min(0).nullable(),
    nb_autre_personnel_etp: yup.number().min(0).nullable(),
    nb_preposes_femme: yup.number().integer().min(0).nullable(),
    nb_preposes_homme: yup.number().integer().min(0).nullable(),
    niveaux_qualification: yup.object({
      n1: validate_nb_preposes_niveaux_qualitifcation(),
      n2: validate_nb_preposes_niveaux_qualitifcation(),
      n3: validate_nb_preposes_niveaux_qualitifcation(),
      n4: validate_nb_preposes_niveaux_qualitifcation(),
      n5: validate_nb_preposes_niveaux_qualitifcation(),
      n6: validate_nb_preposes_niveaux_qualitifcation(),
    }),
  });

function validate_nb_preposes_niveaux_qualitifcation() {
  return yup.object({
    nb_preposes: yup.number().integer().min(0).nullable(),
    nb_preposes_etp: yup.number().min(0).nullable(),
  });
}
