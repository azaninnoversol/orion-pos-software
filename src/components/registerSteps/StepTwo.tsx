"use client";
import React, { useState, useRef, useEffect } from "react";

// animations
import { motion } from "framer-motion";

// components
import FormInput from "./FormInput";

// redux
import { useGetCitiesMutation, useGetCountriesQuery } from "@/redux/locationApi/locationApi";
import SearchableDropdown from "../SearchableDropdown";
import { Phone } from "lucide-react";
import { Input } from "../ui/input";

interface StepTwoProps {
  FormData: {
    address?: string;
    country?: string;
    city?: string;
    zipCode?: string;
    branch?: {
      id: string;
      name: string;
    };
    phone?: string | number;
    shiftStartTime?: string | Date;
    shiftEndTime?: string | Date;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ FormData, handleChange }) => {
  const [searchCountry, setSearchCountry] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citiesData, setCitiesData] = useState<string[]>([]);
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const { data: countriesData = [], isLoading } = useGetCountriesQuery(searchCountry);

  const [getCities, { isLoading: isFetchingCities }] = useGetCitiesMutation();

  const handleSelectCountry = async (countryName: string) => {
    handleChange({
      target: { name: "country", value: countryName },
    } as React.ChangeEvent<HTMLInputElement>);

    setSearchCountry(countryName);
    setShowCountryDropdown(false);
    setCitiesData([]);
    setSearchCity("");

    try {
      const response = await getCities({ country: countryName }).unwrap();
      setCitiesData(response?.data || []);
    } catch (error) {
      setCitiesData([]);
    }
  };

  const handleSelectCity = (cityName: string) => {
    handleChange({
      target: { name: "city", value: cityName },
    } as React.ChangeEvent<HTMLInputElement>);
    setSearchCity(cityName);
    setShowCityDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node) && cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (FormData.country) setSearchCountry(FormData.country);
    if (FormData.city) setSearchCity(FormData.city);
  }, [FormData.country, FormData.city]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <SearchableDropdown
        label="Country"
        placeholder="Search Country..."
        value={searchCountry}
        setValue={setSearchCountry}
        data={countriesData}
        displayKey="name.common"
        loading={isLoading}
        showDropdown={showCountryDropdown}
        setShowDropdown={setShowCountryDropdown}
        onSelect={(country: any) => handleSelectCountry(country?.name?.common)}
        parentRef={countryRef}
      />

      <SearchableDropdown
        label="City"
        placeholder={!citiesData.length ? "Select a country first..." : "Search or select city..."}
        value={searchCity}
        setValue={setSearchCity}
        data={citiesData}
        loading={isFetchingCities}
        showDropdown={showCityDropdown}
        setShowDropdown={setShowCityDropdown}
        onSelect={(city: any) => handleSelectCity(city)}
        disabled={!FormData.country}
        parentRef={cityRef}
      />

      <FormInput
        label="Address"
        name="address"
        placeholder="Enter your address"
        value={FormData.address || ""}
        onChange={handleChange}
        disabled={!FormData.city || !searchCity}
      />

      <FormInput
        label="Zip Code"
        name="zipCode"
        placeholder="Enter zip code"
        value={FormData.zipCode || ""}
        onChange={handleChange}
        disabled={!FormData.city || !searchCity}
      />

      <FormInput
        label="Branch Name"
        name="branch"
        placeholder="Enter Branch Name"
        value={FormData.branch?.name || ""}
        onChange={handleChange}
        disabled={!FormData.city || !searchCity}
      />

      <FormInput
        label="Phone Number"
        name="phone"
        placeholder="Enter Phone Number"
        value={(FormData.phone as string) || ""}
        onChange={handleChange}
        disabled={!FormData.city || !searchCity}
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Start Time</label>

        <Input
          type="time"
          step="1"
          name="shiftStartTime"
          value={(FormData.shiftStartTime as string) ?? ""}
          onChange={handleChange}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      {/* End Time */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">End Time</label>
        <Input
          type="time"
          step="1"
          name="shiftEndTime"
          value={(FormData.shiftEndTime as string) ?? ""}
          onChange={handleChange}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>
    </motion.div>
  );
};

export default React.memo(StepTwo);
