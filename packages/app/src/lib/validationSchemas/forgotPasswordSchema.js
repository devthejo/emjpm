import yup from "./yup";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export { forgotPasswordSchema };
