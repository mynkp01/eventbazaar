"use client";
import {
  Articles1,
  Articles2,
  Articles3,
  Articles4,
  Articles5,
  Articles6,
  Gallery1,
  Gallery2,
  Gallery3,
  Gallery4,
  Gallery5,
  Gallery6,
} from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
TabPanel.defaultProps = {
  children: null,
};

function PressConferenceCoverage() {
  const PressConferenceTabs = [
    { _id: 0, event_vertical_name: "Image Gallery" },
    { _id: 1, event_vertical_name: "News Articles" },
  ];
  const [value, setValue] = React.useState(0);
  return (
    <div className="flex flex-col gap-5 px-6 pt-6 lg:px-24">
      <div>
        <Breadcrumb />
        <div className="text-[38px] font-medium capitalize">
          Press Conference Coverage
        </div>
      </div>

      <Tabs
        variant="scrollable"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        aria-label="Main Tabs"
        sx={{
          "& .MuiTabs-flexContainer": {
            gap: "8px",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#5e8c3a",
          },
          "& .MuiTab-root": {
            textTransform: "capitalize",
          },
        }}
      >
        {PressConferenceTabs?.map((tab) => (
          <Tab
            key={tab?._id}
            label={tab?.event_vertical_name}
            value={tab?._id}
            className="rounded-lg font-semibold normal-case !text-black-50"
          />
        ))}
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <CustomImage
              src={Gallery1.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery2.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery3.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Gallery4.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery5.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery6.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery2.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery3.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Gallery1.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery5.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery6.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Gallery4.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Gallery1.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery5.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery6.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Gallery4.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Gallery2.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Gallery3.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Articles1.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Articles2.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Articles3.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <CustomImage
              src={Articles4.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <CustomImage
              src={Articles5.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
            <CustomImage
              src={Articles6.src}
              alt="EducationalBanner"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </TabPanel>
    </div>
  );
}

export default PressConferenceCoverage;
