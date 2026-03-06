import { Box, Modal, Typography } from "@mui/material";
import PageAction from "./PageAction";

const HideModel = ({ ...props }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #6F767E",
    boxShadow: 24,
    borderRadius: 5,
    p: 3,
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="pb-2"
        >
          {props.heading}
        </Typography>
        <Typography
          id="modal-modal-title"
          component="p"
          className="pb-3 sm:pb-6"
        >
          {props.subHeading}
        </Typography>
        <div className="flex justify-end">
          <PageAction
            btnPrimaryLabel="Cancel"
            btnSecondaryLabel={props.btnTitle}
            btnPrimaryFun={() => props.setOpen(false)}
            btnSecondaryFun={props.func}
            className="!mt-0"
            btnSecondaryClassName={
              props.btnSecondaryClassName
                ? props.btnSecondaryClassName
                : "!border-red-300 !text-red-300 hover:!bg-red-300 hover:!text-primary-100"
            }
          />
        </div>
      </Box>
    </Modal>
  );
};

export default HideModel;
