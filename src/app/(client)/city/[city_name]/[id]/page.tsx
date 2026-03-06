"use client";
import NoData from "@components/NoData";
import {
  selectCitiesData,
  selectSelectedCity,
  setSelectedCity,
} from "@redux/slices/lookupSlice";
import { useAppDispatch } from "@redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { isEmpty } from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";
import VendorDetails from "../../../vendor-details/[id]/page";

const VendorDetailsFromCity = () => {
  const { city_name, id }: { [key: string]: string } = useParams();

  const dispatch = useAppDispatch();
  const citiesData = useSelector(selectCitiesData);
  const selectedCity = useSelector(selectSelectedCity);

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
    } else {
      cityExist = false;
      setCityNotFound(true);
    }
    const url = `${ROUTES.client.city}/${customEncodeURIComponent(cityExist ? cityDataByFind?.name : city_name)}/${id}`;
    window.history.replaceState(null, "", url);
  }, [citiesData, city_name, selectedCity, cityNotFound]);

  return cityNotFound ? (
    <NoData text={`No Vendor Found for ${city_name}`} />
  ) : (
    <VendorDetails />
  );
};

export default VendorDetailsFromCity;
