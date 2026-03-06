import authSlice from "@redux/slices/authSlice";
import lookupSlice from "@redux/slices/lookupSlice";
import utilSlice from "@redux/slices/utilSlice";
import vendorSlice from "@redux/slices/vendorSlice";

const rootReducer = {
  auth: authSlice,
  util: utilSlice,
  vendor: vendorSlice,
  lookup: lookupSlice,
};

export default rootReducer;
