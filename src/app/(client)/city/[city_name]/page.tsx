"use client";
import { apiHandler } from "@api/apiHandler";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import ExploreVendorsByCategories from "@components/ExploreVendorsByCategories";
import NoData from "@components/NoData";
import VendorDetailsList from "@components/VendorDetailsList";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectCitiesData,
  selectSelectedCity,
  setSelectedCity,
} from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";

const CityName = () => {
  const routes = useRouter();
  const { city_name }: { [key: string]: string } = useParams();

  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const citiesData = useSelector(selectCitiesData);
  const selectedCity = useSelector(selectSelectedCity);

  const [exploreVendorsData, setExploreVendorsData] = useState([]);
  const [verticalsData, setVerticalsData] = useState([]);
  const [cityNotFound, setCityNotFound] = useState(false);

  useEffect(() => {
    let cityExist = false;
    const cityDataByFind = citiesData?.find(
      (i) =>
        i?.name?.toLowerCase() ===
        customDecodeURIComponent(city_name)?.toLowerCase(),
    );

    if (!isEmpty(cityDataByFind)) {
      if (selectedCity?._id !== cityDataByFind?._id) {
        dispatch(setSelectedCity(cityDataByFind));
      }
      cityExist = true;
      setCityNotFound(false);
      loadExploreVendorsData();
      loadVerticals();
    } else {
      cityExist = false;
      setCityNotFound(true);
    }
    const url = `${ROUTES.client.city}/${customEncodeURIComponent(cityExist ? cityDataByFind?.name : city_name)}`;
    window.history.replaceState(null, "", url);
  }, [citiesData, city_name, selectedCity, cityNotFound]);

  const loadExploreVendorsData = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.client.subCategoryList(
        `location_id=${selectedCity?._id}&limit=16`,
      );

      if (status === 200 || status === 201) {
        setExploreVendorsData(data?.data?.records);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const loadVerticals = async () => {
    try {
      const res = await apiHandler.eventVertical.lookup();
      if (res.status === 200 || res.status === 201) {
        setVerticalsData(res.data?.data);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-12 md:my-12">
      <div className="mx-10 flex flex-col gap-12 md:mx-20">
        <div className="flex flex-col gap-4">
          <Breadcrumb />

          {cityNotFound ? (
            <NoData text={`No Data Found For ${city_name}`} />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="w-full overflow-hidden !rounded-lg">
                  <CustomImage
                    src={convertMediaUrl(selectedCity?.horizontal_path)}
                    alt="Main Image"
                    height="100%"
                    width="100%"
                    className="!h-72 !object-cover md:!h-96"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  {!isEmpty(selectedCity?.name) ? (
                    <div className="text-center text-4xl font-bold text-black-50 md:text-left md:text-5xl">
                      {selectedCity?.name}
                    </div>
                  ) : null}

                  {!isEmpty(selectedCity?.description) ? (
                    <div className="text-center text-base leading-relaxed text-black-50 md:text-left md:text-lg">
                      {selectedCity?.description}
                    </div>
                  ) : null}
                </div>
              </div>
              <hr className="border-grey-800" />
            </>
          )}
        </div>

        {!isEmpty(exploreVendorsData) ? (
          <div className="flex flex-col gap-8">
            <div className="text-center text-2xl font-semibold text-black-100 md:text-left">
              Explore Vendors
            </div>
            <ExploreVendorsByCategories
              data={exploreVendorsData}
              link={(category) =>
                `${ROUTES.client.category}/${customEncodeURIComponent(category?.name)}`
              }
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-4 md:gap-6">
          {verticalsData.map((vertical) => (
            <Fragment key={vertical?._id}>
              <VendorDetailsList
                title={`Top ${vertical?.event_vertical_name} Events Service Providers In ${selectedCity?.name}`}
                endpoint={apiHandler.landing.verticalWiseVendor}
                endpointString={`location_id=${selectedCity?._id}&event_vertical_id=${vertical?._id}&user_id=${userData?.user_id}&limit=4`}
                onClickViewAll={() =>
                  routes.push(
                    `${ROUTES.client.events}/${customEncodeURIComponent(vertical?.event_vertical_name)}`,
                  )
                }
                href={(item) =>
                  `${ROUTES.client.city}/${customEncodeURIComponent(city_name)}/${customEncodeURIComponent(item?.company_name)}-${item?.vendor_id}`
                }
              />
              <hr className="border-grey-800" />
            </Fragment>
          ))}
        </div>

        {/* <div className="flex flex-col gap-14">
            <div className="grid grid-cols-1 gap-4">
              <p className="text-center text-2xl font-bold text-black-50 sm:text-left sm:text-4xl">
                Trend Gallery
              </p>
              <p className="text-center text-base text-grey-50 sm:text-left sm:text-lg">
                It is a long-established fact that a reader will be distracted
                by the readable content.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {galleryData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={item.src} alt={`Gallery item ${index + 1}`} />
                  <p className="text-[18px] font-normal text-grey-50">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default CityName;
