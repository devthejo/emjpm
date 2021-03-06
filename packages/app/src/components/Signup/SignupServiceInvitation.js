import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { Heading1 } from "@emjpm/ui";
import Router from "next/router";
import React, { Fragment } from "react";

import { isEmailExists } from "../../query-service/EmailQueryService";
import { SERVICE_MEMBER_INVITATION } from "./queries";
import signup from "./signup";
import { SignupServiceInvitationForm } from "./SignupServiceInvitationForm";

export const SignupServiceInvitation = (props) => {
  const { token } = props;
  const client = useApolloClient();
  const { data, loading, error } = useQuery(SERVICE_MEMBER_INVITATION, {
    variables: { token },
  });

  if (loading) {
    return "Loading...";
  }

  if (error || !data.service_member_invitations.length) {
    return Router.push("/login");
  }

  const [invitation] = data.service_member_invitations;

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const exists = await isEmailExists(client, values.email);

    if (exists) {
      setErrors({ email: "Cet email existe déjà" });
    } else {
      signup({
        body: {
          invitation,
          service: {
            service_id: invitation.service_id,
          },
          user: {
            confirmPassword: values.confirmPassword,
            email: values.email,
            nom: values.nom,
            password: values.password,
            prenom: values.prenom,
            type: "service",
            username: values.email,
          },
        },
        onComplete: () => {
          setSubmitting(false);
        },
        onError: (errors) => {
          console.error(errors);
          setErrors(errors);
        },
        onSuccess: () => {
          Router.push("/login");
        },
      });
    }
  };

  return (
    <Fragment>
      <Heading1
        p="1"
        m={1}
      >{`Création de compte - ${invitation.service.etablissement}`}</Heading1>
      <SignupServiceInvitationForm
        handleSubmit={handleSubmit}
        invitation={invitation}
      />
    </Fragment>
  );
};
