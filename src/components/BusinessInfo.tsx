"use client";
import { apiHandler } from "@api/apiHandler";
import { CustomCheckBox } from "@assets/index";
import { Button, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import {
  isEmpty,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
} from "src/utils/helper";
import { theme } from "tailwind.config";
import LabelField from "./LabelField";

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface BusinessInfoInterface {
  func?: (obj: any) => void;
  vertical_id?: string;
  event_type_id?: { [key: string]: object[] };
  errorMsg?: string;
  disabledOptions?: string[];
}

const BusinessInfo = ({
  func,
  vertical_id,
  event_type_id,
  errorMsg = null,
  disabledOptions,
}: BusinessInfoInterface) => {
  const [verticalsOption, setVerticalsOption] = useState([]);
  const [eventsOption, setEventsOption] = useState([]);
  const [tabsData, setTabsData] = useState({});
  const [payload, setPayload] = useState({
    vertical_id: "",
    event_type_id: {},
  });
  const [isMobileView, setMobileView] = useState(false);

  useEffect(() => {
    setMobileView(window.innerWidth < 768);

    window.addEventListener("resize", () =>
      setMobileView(window.innerWidth < 768),
    );

    return () => {
      window.addEventListener("resize", () =>
        setMobileView(window.innerWidth < 768),
      );
    };
  }, []);

  const loadVerticals = async () => {
    try {
      const res = await apiHandler.eventVertical.lookup();
      if (res.status === 200 || res.status === 201) {
        setVerticalsOption(res.data.data);
        setPayload((prevValue) => {
          let obj = { ...prevValue };

          if (isEmpty(Object.keys(event_type_id)?.[0])) {
            obj.vertical_id = res.data?.data[0]?._id;
          }

          return obj;
        });
        loadEvents(res.data?.data);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  const loadEvents = async (data) => {
    try {
      const res = await apiHandler.eventType.lookup(
        `event_vertical_id=${data
          ?.map((i) => i?._id)
          ?.join(",")
          ?.toString()}`,
      );
      if (res.status === 200 || res.status === 201) {
        setEventsOption(res.data.data);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!isEmpty(vertical_id) || !isEmpty(event_type_id)) {
      setPayload((prevData) => ({
        ...prevData,
        vertical_id: Object.keys(event_type_id)?.[0],
        event_type_id: event_type_id || {},
      }));
    }
    loadVerticals();
  }, []);

  useEffect(() => {
    const manualGroupBy = (array, keyFunction) => {
      const result = {};

      array.forEach((item) => {
        const key = keyFunction(item);

        if (isEmpty(result[key])) {
          result[key] = [];
        }

        result[key].push(item);
      });

      return result;
    };

    if (!isEmpty(verticalsOption) && !isEmpty(eventsOption)) {
      verticalsOption?.map((i) => {
        setTabsData(
          manualGroupBy(
            eventsOption,
            ({ event_vertical_id }) => event_vertical_id,
          ),
        );
      });
    }
  }, [verticalsOption, eventsOption]);

  const handleCheck = (e, key, obj) => {
    let mainObj = { ...payload.event_type_id };

    if (!(key in mainObj)) {
      mainObj = { ...mainObj, [key]: [] };
    }

    let idArr = [...mainObj?.[key]];
    if (e.target.checked) {
      idArr?.push(obj?._id);
    } else {
      let findIndex = idArr?.findIndex((item) => item === obj._id);
      if (findIndex !== -1) {
        idArr?.splice(findIndex, 1);
      }
    }
    setPayload((prevValue) => {
      let data = { ...prevValue };

      if (isEmpty(idArr)) {
        delete data.event_type_id[key];
      } else {
        data.event_type_id = { ...data.event_type_id, [key]: idArr };
      }

      return data;
    });
  };

  const handleSelectAll = () => {
    setPayload((prevValue) => {
      let data = { ...prevValue };

      let idArr = tabsData?.[payload?.vertical_id]?.map((i) => i?._id);

      if (
        idArr?.length ===
        prevValue?.event_type_id?.[payload?.vertical_id]?.length
      ) {
        data.event_type_id = {
          ...data.event_type_id,
          [payload?.vertical_id]: [],
        };
        delete data.event_type_id[payload?.vertical_id];
      } else {
        data.event_type_id = {
          ...data.event_type_id,
          [payload?.vertical_id]: idArr,
        };
      }

      return data;
    });
  };

  useEffect(() => {
    if (func) {
      func(
        Object.keys(payload?.event_type_id).map((key) => ({
          vertical_id: key,
          event_type_id: payload?.event_type_id[key],
        })),
      );
    }
  }, [payload]);

  const handleInputChange = (value: string) => {
    setPayload((prevData) => ({ ...prevData, vertical_id: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <LabelField
          labelText="Select Event Type & Events"
          toolTipText="Select Event Type & Events"
          required
        />

        <Tabs
          variant="scrollable"
          value={payload?.vertical_id}
          orientation={isMobileView ? "vertical" : "horizontal"}
          onChange={(e, index) =>
            handleInputChange(verticalsOption[index]?._id)
          }
          aria-label="icon position tabs example"
          style={{
            width: "100%",
            overflow: "hidden",
            backgroundColor: `${theme.extend.colors["blue"][100]}0D`,
            padding: "4px",
            borderRadius: "8px",
          }}
          classes={{ root: "!text-xs md:!text-sm" }}
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: "4px",
            },
          }}
        >
          {verticalsOption.map((tab, tabIndex) => {
            const selectedTab = tab?._id === payload?.vertical_id;
            const isDataAvailable =
              tab?._id in payload?.event_type_id &&
              payload?.event_type_id?.[tab?._id]?.length > 0;

            return (
              <Tab
                key={tab?._id}
                label={tab?.event_vertical_name}
                style={{
                  flex: "1 1 0%",
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "none",
                  transitionProperty: "all",
                  transitionTimingFunction: "linear",
                  transitionDuration: "300ms",
                  border: `1px solid ${isDataAvailable ? theme.extend.colors["blue"][100] : "transparent"}`,
                  color: selectedTab
                    ? "white"
                    : isDataAvailable
                      ? theme.extend.colors["blue"][100]
                      : null,
                  backgroundColor: selectedTab
                    ? theme.extend.colors["blue"][100]
                    : "transparent",
                  fontSize: "inherit",
                }}
                // disabled={
                //   !(tab?._id in payload?.event_type_id) &&
                //   Object.keys(payload?.event_type_id)?.length >= ruleValue
                // }
                {...a11yProps(tabIndex)}
              />
            );
          })}
        </Tabs>
      </div>

      {/* {!isEmpty(payload.vertical_id) &&
        eventsOption.length !== 0 &&
        (!(
          !(payload?.vertical_id in payload?.event_type_id) &&
          Object.keys(payload?.event_type_id)?.length >= ruleValue
        ) ? ( */}
      <div>
        <div className="flex justify-between">
          <LabelField labelText="Events" toolTipText="Select Events" required />
          <Button onClick={handleSelectAll} className="!normal-case">
            {payload?.event_type_id?.[payload?.vertical_id]?.length ===
            tabsData?.[payload?.vertical_id]?.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tabsData?.[payload.vertical_id]?.map((option) => (
            <StyledFormControlLabel
              key={option._id}
              className="!mx-0"
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: "inherit !important",
                },
              }}
              control={
                <StyledCheckbox
                  icon={<CustomCheckBox />}
                  checkedIcon={<CustomCheckBox checked />}
                  checked={
                    payload?.event_type_id?.[payload?.vertical_id]?.includes(
                      option?._id,
                    ) ?? false
                  }
                  onChange={(e) => handleCheck(e, payload.vertical_id, option)}
                  disabled={
                    !isEmpty(disabledOptions?.event_type)
                      ? disabledOptions?.event_type?.includes(option?._id)
                      : false
                  }
                />
              }
              label={option.event_type_name}
            />
          ))}
        </div>
      </div>
      {/* ) : (
          <p className="text-center text-xl font-semibold text-primary-400 md:text-2xl">
            This vertical is disabled
          </p>
        ))} */}
      {errorMsg && <p className="error-text">{errorMsg}</p>}
    </div>
  );
};

BusinessInfo.displayName = "BusinessInfo";

export default BusinessInfo;
