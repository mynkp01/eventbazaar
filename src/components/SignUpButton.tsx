import { Box } from "@mui/material";

const SignUpButton = ({
  onClick,
  activeStep,
  // setActiveStep,
  steps,
  buttonText,
  className = "",
  disabled = false,
}: any) => {
  const isLastStep = activeStep === steps.length - 1;
  // const showSkipButton = activeStep === 2;

  return (
    <Box className="mt-5 flex w-full gap-5">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`text-15-700 w-full rounded-xl bg-blue-100 p-3 text-center text-primary-100 ${className}`}
      >
        {isLastStep ? "Submit" : buttonText || "Continue"}
      </button>
      {/* {showSkipButton && (
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className={`text-15-700 w-full rounded-xl p-3 text-blue-100 ${className} border border-blue-100`}
        >
          Skip
        </button>
      )} */}
    </Box>
  );
};

export default SignUpButton;
