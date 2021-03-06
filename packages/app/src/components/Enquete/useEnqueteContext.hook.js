import { useMemo, useReducer, useState } from "react";

export const useEnqueteContext = (props) => {
  const [openConfirmExitInvalidForm, setOpenConfirmExitInvalidForm] = useState(
    false
  );

  const { enqueteReponse, currentStep, navigateToStep, sections } = props;

  const { section, step } = useMemo(() => {
    const section = !sections ? undefined : sections[currentStep.step];
    const step = !section ? undefined : section.steps[currentStep.substep || 0];
    return { section, step };
  }, [currentStep.step, currentStep.substep, sections]);

  const enqueteContextInitialValue = useMemo(
    () => ({
      actions: {
        autoSubmit: false,
      },
      form: {
        dirty: false,
        nextStep: getNextPageStep(sections, currentStep),
        submited: false,
        valid: true, // {section, step} | 'previous' | 'next'
      },
    }),
    [currentStep, sections]
  );

  const enqueteReponseStatus = enqueteReponse ? enqueteReponse.status : "";
  const readOnly = enqueteReponseStatus !== "draft";

  function enqueteContextReducer(state, action) {
    switch (action.type) {
      case "submit-and-navigate": {
        const nextStep =
          !action.value || action.value === "next"
            ? getNextPageStep(sections, currentStep)
            : action.value === "previous"
            ? getPrevPageStep(sections, currentStep)
            : action.value;

        if (!readOnly && state.form.dirty) {
          // form has been modified
          if (state.form.valid) {
            return {
              ...state,
              actions: {
                ...state.actions,
                autoSubmit: true,
              },
              form: {
                ...state.form,
                nextStep,
              },
            };
          } else {
            setOpenConfirmExitInvalidForm(true);
            return {
              ...state,
              form: {
                ...state.form,
                nextStep,
                submited: true,
              },
            };
          }
        } else {
          navigateToStep(nextStep);
          return {
            ...state,
            form: {
              ...state.form,
              nextStep,
            },
          };
        }
      }
      case "navigate-to-next-page":
        navigateToStep(state.form.nextStep);
        // reset state
        return enqueteContextInitialValue;
      case "set-form-dirty":
        return {
          ...state,
          form: {
            ...state.form,
            dirty: action.value,
          },
        };
      case "set-form-valid":
        return {
          ...state,
          form: {
            ...state.form,
            valid: action.value,
          },
        };

      default:
        console.warn(`Unexpected state action ${action}`, state);
        throw new Error(`Unexpected state action ${action.type}`);
    }
  }
  const [enqueteContext, dispatchEnqueteContextEvent] = useReducer(
    enqueteContextReducer,
    enqueteContextInitialValue
  );

  return {
    confirmExitInvalidFormDialog: {
      onCancel: () => {
        setOpenConfirmExitInvalidForm(false);
      },
      onConfirm: () => {
        setOpenConfirmExitInvalidForm(false);
        dispatchEnqueteContextEvent({ type: "navigate-to-next-page" });
      },
      open: openConfirmExitInvalidForm,
    },
    dispatchEnqueteContextEvent,
    enqueteContext,
    saveAndNavigate,
    section,
    step,
  };

  async function saveAndNavigate({ step, substep }) {
    dispatchEnqueteContextEvent({
      type: "submit-and-navigate",
      value: { step, substep },
    });
  }

  function getNextPageStep(sections, currentStep) {
    const { step, substep } = currentStep;
    const currentSection =
      sections && sections.length > step ? sections[step] : undefined;

    if (currentSection) {
      if (
        currentSection.steps.length <= 1 ||
        substep + 1 === currentSection.steps.length
      ) {
        return { step: step + 1, substep: 0 };
      } else {
        return { step, substep: substep + 1 };
      }
    }
  }

  function getPrevPageStep(sections, currentStep) {
    const { step, substep } = currentStep;
    if (substep > 0) {
      return { step, substep: substep - 1 };
    } else if (currentStep.step - 1 >= 0) {
      const substep = sections[currentStep.step - 1].steps.length;
      return { step: currentStep.step - 1, substep: substep - 1 };
    }
  }
};
