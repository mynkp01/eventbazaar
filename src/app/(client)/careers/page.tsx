"use client";
import { apiHandler } from "@api/apiHandler";
import {
  CareerClientApproachIcon,
  CareerCommunityIcon,
  CareerDiversityIcon,
  CareerExcellenceIcon,
  CareerInnovationIcon,
  CareerIntegrityIcon,
} from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import DragAndDrop from "@components/DragAndDrop";
import LabelField from "@components/LabelField";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useState } from "react";
import { MAILS } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

interface Details {
  full_name: string;
  contact_number: string;
  email: string;
  applied_position: string;
  coverLetter: string;
  doc_path: any;
}

const initialForm = {
  full_name: "",
  contact_number: "",
  email: "",
  applied_position: "",
  coverLetter: "",
  doc_path: null,
};

const Careers = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Details>(initialForm);

  const validateField = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "full_name":
        if (!value.trim()) error = "Please enter your name";
        break;
      case "email":
        if (!value.trim()) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "contact_number":
        if (!value.trim()) error = "Please enter your contact number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid contact number";
        break;
      case "coverLetter":
        if (!value.trim()) error = "Please enter cover letter";
        break;
      case "applied_position":
        if (!value.trim()) error = "Please enter applied position";
        break;
      case "doc_path":
        if (isEmpty(value)) error = "Please upload your resume";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFiles = (files) => {
    if (!isEmpty(files)) {
      setFormData((prevData) => ({
        ...prevData,
        doc_path: files[0],
      }));
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    const requiredFields = [
      "full_name",
      "contact_number",
      "email",
      // "applied_position",
      "coverLetter",
      "doc_path",
    ];

    requiredFields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      dispatch(setIsLoading(true));
      let fd = new FormData();
      fd.append("full_name", formData.full_name);
      fd.append("contact_number", formData.contact_number);
      fd.append("email", formData.email);
      fd.append("coverLetter", formData.coverLetter);
      fd.append("doc_path", formData.doc_path);

      const { data, status } = await apiHandler.career.post(fd);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        setFormData(initialForm);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="relative flex flex-col gap-10">
      <style jsx>{`
        ol li {
          list-style-type: decimal !important;
          list-style-position: inside !important;
        }
      `}</style>
      <div className="flex flex-col gap-6 px-6 py-6 !pb-0 md:gap-12 md:px-20 md:py-12">
        <Breadcrumb />

        <div className="flex flex-col gap-8">
          <p className="heading-40">
            Where Passion Meets Purpose: Create Extraordinary Experiences with
            Us
          </p>

          <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-14">
            <div className="flex w-full flex-col gap-8 lg:w-1/2 xl:w-2/3">
              {/* Our Company */}
              <div className="flex flex-col gap-4 text-sm md:text-base">
                <p className="text-2xl font-semibold md:text-3xl">
                  Our Company
                </p>
                <p>
                  <Link
                    href="https://eventbazaar.com"
                    className="font-semibold !text-green-400"
                  >
                    EventBazaar.com
                  </Link>{" "}
                  is a dynamic and innovative, event industry marketplace
                  connecting clients with the best vendors, venues, and event
                  professionals across India. From weddings and corporate
                  gatherings to cultural festivities, we connect people with
                  top-tier vendors, innovative ideas, and seamless planning
                  tools.
                </p>
                <p>
                  With a presence across multiple cities and a growing
                  community,{" "}
                  <Link
                    href="https://eventbazaar.com"
                    className="font-semibold !text-green-400"
                  >
                    EventBazaar.com
                  </Link>{" "}
                  is more than just a company – it’s a movement. We empower our
                  team to think big, innovate boldly, and celebrate life’s
                  milestones with purpose and joy. If you’re ready to shape the
                  future of events, this is the place for you!
                </p>
              </div>

              {/* Our Values */}
              <div className="flex flex-col gap-4">
                <p className="text-2xl font-semibold md:text-3xl">
                  Our Values:
                </p>
                <div className="grid grid-cols-1 justify-between gap-x-4 gap-y-10 py-10 xxs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
                  <div className="flex flex-col items-center gap-5">
                    <CareerExcellenceIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Excellence in
                      <br />
                      Everything
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <CareerClientApproachIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Client-Centered
                      <br />
                      Approach
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <CareerInnovationIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Innovation and
                      <br />
                      Creativity
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <CareerIntegrityIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Integrity and
                      <br />
                      Transparency
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <CareerCommunityIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Collaboration and
                      <br />
                      Community
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <CareerDiversityIcon className="size-16 min-h-14 min-w-14 md:min-h-16 md:min-w-16" />
                    <p className="text-center text-sm font-medium md:text-base">
                      Diversity and
                      <br />
                      Inclusion
                    </p>
                  </div>
                </div>
                {/* <ol>
                  <li>
                    <strong>Excellence in Everything</strong>: Commitment to
                    quality in all aspects of our services.
                  </li>
                  <li>
                    <strong>Client-Centered Approach</strong>: Putting clients'
                    needs and vision first.
                  </li>
                  <li>
                    <strong>Innovation and Creativity</strong>: Continuously
                    improving and finding new solutions.
                  </li>
                  <li>
                    <strong>Integrity and Transparency</strong>: Honest
                    communication and ethical business practices.
                  </li>
                  <li>
                    <strong>Collaboration and Community</strong>: Valuing
                    teamwork and strong partnerships.
                  </li>
                  <li>
                    <strong>Diversity and Inclusion</strong>: Embracing
                    different perspectives to better serve our clients.
                  </li>
                </ol> */}
              </div>

              {/* Join Our Journey */}
              <div className="flex flex-col gap-4">
                <p className="text-2xl font-semibold md:text-3xl">
                  Join Our Journey
                </p>
                <p>
                  At{" "}
                  <Link
                    href="https://eventbazaar.com"
                    className="font-semibold !text-green-400"
                  >
                    EventBazaar.com
                  </Link>
                  , you'll be more than an employee - you'll be a crucial part
                  of our mission to revolutionize the experience. We're always
                  looking for talented, energetic, and creative individuals to
                  join our dynamic team. We offer exciting opportunities to
                  grow, innovate, and make an impact in the world of event
                  industry.
                </p>
                <p>
                  We celebrate diversity and are committed to creating an
                  inclusive environment for all employees.
                </p>
                <p>
                  Ready to make an impact? Apply today and take the first step
                  toward a rewarding career with EventBazaar.com. You can
                  contact us at{" "}
                  <Link
                    href="tel:+917069122777"
                    className="font-semibold !text-green-400"
                  >
                    +91 70691 22777
                  </Link>
                  . You can also email your query/resume to{" "}
                  <Link
                    href={`mailto:${MAILS.CAREERS_MAIL}`}
                    className="font-semibold !text-green-400"
                  >
                    {MAILS.CAREERS_MAIL}
                  </Link>
                  . We are looking for driven and skilled individuals for the
                  following positions:
                </p>
                <ol>
                  <li>Front-end Developer</li>
                  <li>Backend Developer</li>
                  <li>UI/UX Designer</li>
                </ol>
              </div>
            </div>

            {/* Job Application Form */}
            <div className="flex h-fit w-full flex-col gap-2 rounded-xl bg-gray-100 p-6 md:gap-4 lg:mt-12 lg:w-1/2 xl:w-1/3">
              <p className="text-2xl font-medium sm:text-3xl">
                Job Application Form
              </p>

              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2">
                  <div className="col-span-2 sm:col-span-1">
                    <CustomInput
                      name="full_name"
                      label="Full Name"
                      className="!mt-0 bg-white"
                      labelClass="text-gray-500"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="error-text">{errors?.full_name}</p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <CustomInput
                      className="!mt-0 bg-white"
                      label="Contact Number"
                      id="contact"
                      type="number"
                      value={formData.contact_number}
                      maxLength={10}
                      required
                      onChange={handleInputChange}
                      name="contact_number"
                    />
                    <p className="error-text">{errors?.contact_number}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <CustomInput
                    label="Email"
                    className="!mt-0 bg-white"
                    labelClass="text-gray-500"
                    type="email"
                    name="email"
                    value={formData.email}
                    required
                    onChange={handleInputChange}
                  />
                  <p className="error-text">{errors?.email}</p>
                </div>

                <div className="col-span-2">
                  <CustomInput
                    name="coverLetter"
                    type="text"
                    value={formData?.coverLetter}
                    onChange={handleInputChange}
                    className="!mt-2 h-24 w-full rounded !bg-white !p-4"
                    isTextArea
                    label="Cover Letter"
                    required
                  />
                  {errors?.coverLetter && (
                    <p className="error-text mt-1 text-sm text-red-500">
                      {errors?.coverLetter}
                    </p>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <LabelField labelText="Resume" required />
                  {formData?.doc_path ? (
                    <p className="text-sm text-gray-500">
                      {formData?.doc_path?.name}
                    </p>
                  ) : (
                    <>
                      <DragAndDrop
                        accept="application/pdf"
                        onFilesSelected={handleFiles}
                        text="Upload Pdf"
                        text2="Drag Your Pdf Here or Click To Browse"
                        className="!h-full !w-full"
                      />

                      {errors?.doc_path && (
                        <p className="error-text mt-1 text-sm text-red-500">
                          {errors?.doc_path}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <CustomButton
                loading={submitButtonLoading}
                className="!flex !h-12 !w-full !items-center !justify-center !rounded-md !border !bg-green-400 !text-white !transition-all !duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
                text={"Submit"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
