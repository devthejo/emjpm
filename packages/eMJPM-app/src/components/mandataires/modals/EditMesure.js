import Form from "react-jsonschema-form";

import { connectModal } from "redux-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { format } from "date-fns";
import { updateMesure } from "../actions/mesures";
import Layout from "./Layout";

const schema = {
  title: "Ouvrir une nouvelle mesure",
  type: "object",
  required: ["code_postal", "ville", "civilite", "annee", "residence", "date_ouverture"],
  properties: {
    date_ouverture: {
      type: "string",
      format: "date"
    },
    type: {
      type: "string",
      enum: [
        "Tutelle",
        "Curatelle",
        "Sauvegarde de justice",
        "Mesure ad hoc",
        "MAJ",
        "tutelle aux biens",
        "tutelle à la personne",
        "tutelle aux biens et à la personne",
        "curatelle simple aux biens",
        "curatelle simple à la personne",
        "curatelle simple aux biens et à la personne",
        "curatelle renforcée aux biens",
        "curatelle renforcée à la personne",
        "curatelle renforcée aux biens et à la personne",
        "sauvegarde de justice",
        "sauvegarde de justice avec mandat spécial"
      ]
    },
    residence: {
      type: "string",
      enum: ["A domicile", "En établissement"]
    },
    code_postal: { type: "string" },
    ville: { type: "string" },
    civilite: { type: "string", enum: ["F", "H"] },
    annee: { type: "integer", maxLength: 4 },
    numero_dossier: { type: "string", default: " " }
  }
};

const uiSchema = {
  date_ouverture: {
    "ui:autofocus": true,
    "ui:title": "Ouverture de la mesure",
    classNames: "input_mesure_ouverture",
    "ui:options": {
      label: true
    }
  },
  code_postal: {
    "ui:placeholder": "Code Postal",
    "ui:title": "Code Postal",
    classNames: "input_mesure_commune",
    "ui:options": {
      label: false
    }
  },
  etablissement: {
    "ui:placeholder": "Etablissement",
    "ui:options": {
      label: false
    }
  },
  annee: {
    "ui:placeholder": "Année de naissance",
    "ui:title": "Année de naissance",
    classNames: "input_mesure_annee"
  },
  civilite: {
    "ui:placeholder": "Genre",
    classNames: "input_mesure_civilite",
    "ui:title": "Le majeur à protéger",
    "ui:options": {
      label: true
    }
  },
  ville: {
    "ui:placeholder": "Commune",
    "ui:title": "Commune",
    classNames: "input_mesure_commune",
    "ui:options": {
      label: false
    }
  },
  residence: {
    "ui:placeholder": "Lieu de vie",
    "ui:title": "Résidence du majeur à protéger",
    classNames: "input_mesure_residence",
    "ui:options": {
      label: true
    }
  },
  type: {
    "ui:placeholder": "Type de mesure",
    "ui:title": "Type de mesure",

    classNames: "input_mesure_type",
    "ui:options": {
      label: false
    }
  }
};

const EditMesure = ({ show, handleHide, formData, onSubmit, ...props }) => {
  // todo: we should have perfect mapping api<->data<->form
  const cleanData = {
    ...formData,
    date_ouverture: format(formData.date_ouverture, "YYYY-MM-DD"),
    annee: parseInt(formData.annee)
  };
  return (
    <Layout show={show} handleHide={handleHide}>
      <Form schema={schema} uiSchema={uiSchema} formData={cleanData} onSubmit={onSubmit}>
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <button type="submit" className="btn btn-success" style={{ padding: "10px 30px" }}>
            Valider
          </button>
        </div>
      </Form>
    </Layout>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ onSubmit: ({ formData }) => updateMesure(formData) }, dispatch);

// connect to redux store actions
// connect to redux-modal
export default connect(
  null,
  mapDispatchToProps
)(connectModal({ name: "EditMesure", destroyOnHide: true })(EditMesure));