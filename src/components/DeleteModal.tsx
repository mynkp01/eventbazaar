import { Box, Modal, Typography } from "@mui/material";
import PageAction from "./PageAction";

function DeleteModal({ ...props }) {
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
          Are you sure want to delete this?
        </Typography>
        <Typography
          id="modal-modal-title"
          component="p"
          className="pb-3 sm:pb-6"
        >
          {`Deleted item won't be recovered.`}
        </Typography>
        <div className="flex justify-end">
          <PageAction
            btnPrimaryLabel="Cancel"
            btnSecondaryLabel="Delete"
            btnPrimaryFun={() => props.setOpen(false)}
            btnSecondaryFun={props.func}
            className="!mt-0"
            btnSecondaryClassName="!border-red-300 !text-red-300 hover:!bg-red-300 hover:!text-primary-100"
          />
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteModal;
