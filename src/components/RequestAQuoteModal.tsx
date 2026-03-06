"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight, Logo } from "@assets/index";
import { Modal } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectSelectedCity,
  selectVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ARTIST_VALUES, QUOTE_TYPE } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";
const CustomDatePicker = dynamic(() => import("@components/CustomDatePicker"), {
  ssr: true,
});
const FetchDropdown = dynamic(() => import("@components/FetchDropdown"), {
  ssr: true,
});

const RequestAQuoteModal = ({
  visible,
  setVisible,
  vendorId,
  fromArtist = true,
}) => {
  const verticalsAndEventTypes = useSelector(selectVerticalsAndEventTypes);
  const userData = useSelector(selectUser);
  const selectedCity = useSelector(selectSelectedCity);

  const [eventTime, setEventTime] = useState([]);
  const [formData, setFormData] = useState({
    eventDate: "",
    city: null,
    event_time: "",
    numberOfPeople: "",
    venue_id: "",
    vertical_id: "",
  });
  const [errors, setErrors] = useState<typeof formData>(null);

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "eventDate":
        if (isEmpty(value)) error = "Please enter your event date";
        break;
      case "city":
        if (isEmpty(value)) error = "Please enter your city";
        break;
      case "event_time":
        if (isEmpty(value)) error = "Please select event time";
        break;
      case "numberOfPeople":
        if (isEmpty(value)) error = "Please enter no. of people";
        break;
      case "venue_id":
        if (isEmpty(value)) error = "Please enter your venue";
        break;
      case "vertical_id":
        if (isEmpty(value)) error = "Please select event type";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleFormSubmit = async () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      const err = validateFields(key, formData[key]);
      if (err[key]) {
        newErrors[key] = err[key];
      }
    });

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        vendor_id: vendorId,
        customer_id: userData?.user_id,
        event_date: formData?.eventDate,
        event_time: formData?.event_time,
        vertical_id: formData?.vertical_id,
        venue_id: formData?.venue_id,
        city: formData?.city?.name,
        noOfPeople_id: formData?.numberOfPeople,
        quote_type: fromArtist ? QUOTE_TYPE.ARTIST : QUOTE_TYPE.VENUE,
        location_id: selectedCity?._id,
      };

      try {
        const { data, status } = await apiHandler.requestQuote.post(payload);

        if (status === 200 || status === 201) {
          showToast("success", data?.message);
          resetStates();
        } else {
          showToast("error", data?.message);
        }
      } catch (error) {
        showToast("error", error?.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateFields(name, value);
  };

  const handleFetchDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateFields(name, value);
  };

  useEffect(() => {
    if (visible) {
      loadEventTime();
    }
  }, [visible]);

  const loadEventTime = async () => {
    try {
      const res = await apiHandler.values.lookup(
        `value=${ARTIST_VALUES.ARTIST_EVENT_TIME}`,
      );
      if (res?.status === 200 || res?.status === 201) {
        setEventTime(res?.data?.data);
      }
    } catch (error) {}
  };

  const resetStates = () => {
    setVisible(false);
    setErrors(null);
    setEventTime([]);
    setFormData({
      eventDate: "",
      city: null,
      event_time: "",
      numberOfPeople: "",
      venue_id: "",
      vertical_id: "",
    });
  };

  return (
    <Modal
      open={visible}
      onClose={resetStates}
      className="flex h-full w-full items-center justify-center"
    >
      <div className="relative z-50 grid !h-screen w-full max-w-2xl overflow-y-auto bg-white p-8 shadow-loginContainerShadow sm:rounded-xl md:h-[680px] md-h:!h-fit">
        <div className="flex flex-col gap-5 md-h:gap-10">
          <Logo />

          <p className="text-xl font-semibold text-black-50 md:text-2xl">
            Request a Quote for {fromArtist ? "Artist" : "Venue"}
          </p>

          <button
            onClick={resetStates}
            className="absolute right-8 top-8 z-10 cursor-pointer rounded-lg bg-primary-100 p-1.5"
          >
            <CloseLight />
          </button>
        </div>

        <hr className="my-5 border-t-2 border-t-primary-50" />

        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <CustomDatePicker
              value={formData?.eventDate}
              onChange={(newValue) =>
                handleInputChange({
                  target: {
                    name: "eventDate",
                    value: new Date(newValue).toISOString(),
                  },
                })
              }
              label="Event Date"
              picker="date"
              placeholder="MM/DD/YYYY"
              minDate={new Date()}
              format={{ date: "MM/DD/YYYY" }}
              className="focus:ring-none rounded-md border !py-6 text-gray-700 focus:outline-none"
              labelClassName="!mb-2.5 !text-14-600 !text-primary-800"
            />
            {errors?.eventDate ? (
              <p className="error-text">{errors?.eventDate}</p>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <FetchDropdown
              endPoints={apiHandler.values.allCitiesList}
              label="Event City"
              filterStr="NA"
              placeholder="City"
              value={formData?.city?.id}
              labelClass="!mb-2.5 !text-14-600 !text-primary-800"
              textMenuSx={(customStyles) => ({
                ...customStyles,
                "& .MuiInputBase-root": {
                  ...customStyles["& .MuiInputBase-root"],
                  padding: "24px 16px !important",
                  height: "20px !important",
                },
              })}
              display="name"
              containerClass="!mt-0"
              className="!p-0"
              objKey="city"
              idKey="id"
              func={handleFetchDropdownChange}
            />
            {errors?.city ? <p className="error-text">{errors?.city}</p> : null}
          </div>

          <div className="text-14-600 text-primary-800 md:col-span-2">
            <p className="mb-2.5">Event Time</p>
            <div className="flex items-center gap-3">
              {eventTime?.map((time) => (
                <div key={time?._id} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="event_time"
                    id={time?._id}
                    value={time?._id}
                    onChange={handleInputChange}
                    checked={formData?.event_time === time?._id}
                    className="size-4 rounded-full border-2 border-gray-800 accent-green-400"
                  />
                  <label htmlFor={time?._id}>{time?.name}</label>
                </div>
              ))}
            </div>
            {errors?.event_time ? (
              <p className="error-text">{errors?.event_time}</p>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <FetchDropdown
              endPoints={apiHandler.values.lookup}
              label="No. of People in Event"
              filterStr={`value=${ARTIST_VALUES.NO_OF_PEOPLE}`}
              placeholder="Select Number of People"
              value={formData?.numberOfPeople}
              labelClass="!mb-2.5"
              textMenuSx={(customStyles) => ({
                ...customStyles,
                "& .MuiInputBase-root": {
                  ...customStyles["& .MuiInputBase-root"],
                  padding: "24px 16px !important",
                  height: "20px !important",
                },
              })}
              display="name"
              containerClass="!mt-0"
              className="!p-0"
              objKey="numberOfPeople"
              func={(label, value) =>
                handleFetchDropdownChange(label, value?._id)
              }
            />
            {errors?.numberOfPeople ? (
              <p className="error-text">{errors?.numberOfPeople}</p>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <FetchDropdown
              endPoints={apiHandler.eventType.eventVenueLookup}
              label="Venue"
              filterStr={`value=${ARTIST_VALUES.ARTIST_VENUE_TYPE}`}
              placeholder="Venue"
              value={formData?.venue_id}
              labelClass="!mb-2.5"
              textMenuSx={(customStyles) => ({
                ...customStyles,
                "& .MuiInputBase-root": {
                  ...customStyles["& .MuiInputBase-root"],
                  padding: "24px 16px !important",
                  height: "20px !important",
                },
              })}
              display="name"
              containerClass="!mt-0"
              className="!p-0"
              objKey="venue_id"
              func={(label, value) =>
                handleFetchDropdownChange(label, value?._id)
              }
            />
            {errors?.venue_id ? (
              <p className="error-text">{errors?.venue_id}</p>
            ) : null}
          </div>

          <div className="text-14-600 text-primary-800 md:col-span-2">
            <p className="mb-2.5">Event Type</p>
            <div className="grid items-center gap-3 xs:flex">
              {verticalsAndEventTypes?.map((vertical) => (
                <div key={vertical?._id} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="vertical_id"
                    id={vertical?._id}
                    value={vertical?._id}
                    onChange={handleInputChange}
                    checked={formData?.vertical_id === vertical?._id}
                    className="size-4 rounded-full border-2 border-gray-800 accent-green-400"
                  />
                  <label htmlFor={vertical?._id}>
                    {vertical?.event_vertical_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {errors?.vertical_id ? (
            <p className="error-text">{errors?.vertical_id}</p>
          ) : null}
        </div>

        <button
          onClick={handleFormSubmit}
          className="mt-8 rounded-md bg-green-400 p-3 text-white"
        >
          Request a Quote
        </button>
      </div>
    </Modal>
  );
};

export default RequestAQuoteModal;
