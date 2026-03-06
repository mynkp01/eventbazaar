"use client";
import { apiHandler } from "@api/apiHandler";
import ManageAccount from "@components/ManageAccount";
import { setDeep } from "@components/SetDeep";
import { selectUser, setUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "src/utils/helper";

interface VendorDetailsInterface {
  _id?: string;
  company_name?: string;
  full_name?: string;
  primary_email?: string;
  primary_contact?: string;
  contacts?: any[];
  location_id?: string;
  business_category_id?: string;
  business_category_code?: string;
  business_sub_category_id?: string[];
  city?: string;
  state?: string;
  // vertical_id?: string[];
  // event_type_id?: string[];
  plan?: {
    _id?: string;
    plan_name?: string;
    plan_code?: string;
    tagline?: string;
    description?: string;
    amount?: number;
    popular?: boolean;
    status?: boolean;
    __v?: number;
    createdAt?: string;
    updatedAt?: string;
    validity?: number;
  };
  vendor_verticals?: any[];
  service_location_id?: string[];
  plan_id?: string;
  plan_name?: string;
  establishment_year?: string;
  gst_number?: string;
  pan_number?: string;
  address?: string;
  bio?: string;
  social_presence?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    pinterest?: string;
    linkedin?: string;
    behance?: string;
  };
  no_of_employees?: string;
  budget?: string;
  top3_client_name?: string[];
}

const Profile = () => {
  const dispatch = useAppDispatch();

  const userData = useSelector(selectUser);
  const [isGstNumber, setIsGstNumber] = useState(true);
  const [vendorDetails, setVendorDetails] = useState<VendorDetailsInterface>({
    _id: "",
    company_name: "",
    full_name: "",
    primary_email: "",
    primary_contact: "",
    contacts: [],
    location_id: "",
    business_category_id: "",
    business_category_code: "",
    business_sub_category_id: [],
    // vertical_id: [],
    // event_type_id: [],
    vendor_verticals: [],
    city: "",
    state: "",
    service_location_id: [],
    plan_id: "",
    plan_name: "",
    establishment_year: "",
    gst_number: "",
    pan_number: "",
    address: "",
    bio: "",
    social_presence: {
      website: "",
      instagram: "",
      twitter: "",
      facebook: "",
      youtube: "",
      pinterest: "",
      linkedin: "",
      behance: "",
    },
    no_of_employees: "",
    budget: "",
    top3_client_name: ["", "", ""],
  });
  const [vendorLogo, setVendorLogo] = useState<any>(null);

  const fetchVendorDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorDetails(userData?.user_id);
      if (res.status === 200 || res.status === 201) {
        setVendorDetails({
          ...res.data?.data,
          vendor_verticals: res.data?.data?.vendor_verticals?.map((i) => ({
            ...i,
            disabled: false,
          })),
        });
        setIsGstNumber(
          res.data.data?.gst_number && res.data.data?.gst_number !== ""
            ? true
            : false,
        );
        setVendorLogo(res.data.data?.logo ? res.data.data?.logo : null);
        dispatch(
          setUser({
            ...userData,
            company_name: res.data.data?.company_name,
            full_name: res.data.data?.full_name,
            primary_email: res.data.data?.primary_email,
            primary_contact: res.data.data?.primary_contact,
            logo: res.data.data?.logo ? res.data.data?.logo.doc_path : null,
            plan_name: res.data.data?.plan?.plan_name,
            plan_code: res.data.data?.plan?.plan_code,
            vertical_id: res.data.data?.vertical_id,
            grade_id: res.data.data?.grade_id,
            price_rule: res.data.data?.price_rule,
            business_category_id: res.data.data?.businessCategory,
          }),
        );
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  // const queryParams = useSearchParams();
  // const id = queryParams.get("id");
  // useEffect(() => {
  //   if (
  //     window &&
  //     !isEmpty(userData) &&
  //     userData?.user_type === USER_TYPES.VENDOR &&
  //     isEmpty(id)
  //   ) {
  //     const url = new URL(window.location.href);
  //     if (!url.searchParams.has("id")) {
  //       url.searchParams.set("id", userData?.user_id);

  //       window.history.replaceState(null, "", url.toString());
  //     }
  //   }
  // }, [userData?.user_id, id]);

  const handleInputChange = (
    path: string,
    value: string,
    setErrors: (obj: any) => void,
  ) => {
    setVendorDetails((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, path, value);
      return newState;
    });

    setErrors((prevState) => {
      const newState = { ...prevState };
      if (path.includes("social_presence.")) {
        setDeep(newState, path, "");
        return newState;
      } else if (path.includes("social_presence")) {
        return { ...newState, social_presence: "" };
      } else {
        setDeep(newState, path, "");
        return newState;
      }
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <h3 className="heading-40">Manage Account</h3>
      <div className="flex h-full flex-col gap-8 rounded-xl bg-primary-100 p-2 sm:p-3 lg:p-6">
        <ManageAccount
          vendorDetails={vendorDetails}
          handleInputChange={handleInputChange}
          fetchVendorDetails={fetchVendorDetails}
          isGstNumber={isGstNumber}
          setIsGstNumber={setIsGstNumber}
          setVendorDetails={setVendorDetails}
          vendorLogo={vendorLogo}
        />
      </div>
    </div>
  );
};

export default Profile;
