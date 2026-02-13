import SearchableDropdown from "@/components/SearchableDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomerDetail } from "@/container/dashboard-pages/customers/data";
import { useGetCitiesMutation, useGetCountriesQuery } from "@/redux/locationApi/locationApi";
import { customerManageService } from "@/services/api_service";
import { User } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";

export interface FormData {
  customerId: string;
  customerName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  buildingNo: string;
  floor: string;
  apartmentNo: string;
}

export const defaultFormData: FormData = {
  customerId: "",
  customerName: "",
  phone: "",
  country: "",
  city: "",
  street: "",
  buildingNo: "",
  floor: "",
  apartmentNo: "",
};

function SearchCustomer({
  setCustomerName,
  setIsTakeAway,
  initialData,
}: {
  setIsTakeAway: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomerName: React.Dispatch<React.SetStateAction<any>>;
  initialData?: FormData;
}) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState<string>("");
  const [customerData, setCustomersData] = useState<CustomerDetail[]>([]);
  const [showCustomerDropDown, setShowCustomerDropDown] = useState(false);
  const customerRef = useRef<HTMLDivElement>(null);

  const [searchCountry, setSearchCountry] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const { data: countriesData = [], isLoading: isLoadingCountries } = useGetCountriesQuery(searchCountry);

  const [searchCity, setSearchCity] = useState<string>("");
  const [citiesData, setCitiesData] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const [getCities, { isLoading: isFetchingCities }] = useGetCitiesMutation();

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fetchCustomers = async () => {
    const data = await customerManageService.getAll();
    setCustomersData(data);
  };

  const handleSelectCustomer = (single: CustomerDetail) => {
    handleChange("customerName", single.customerName ?? "");
    handleChange("phone", single?.phone as string);
    handleChange("customerId", single?.id as string);
  };

  const handleSelectCountry = async (countryName: string) => {
    handleChange("country", countryName);
    setSearchCountry(countryName);
    setShowCountryDropdown(false);
    setSearchCity("");
    setCitiesData([]);

    if (!countryName) return;

    try {
      const res = await getCities({ country: countryName }).unwrap();
      const cities = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setCitiesData(cities);
    } catch (error) {
      setCitiesData([]);
    }
  };

  const handleSelectCity = (cityName: string) => {
    handleChange("city", cityName);
    setSearchCity(cityName);
    setShowCityDropdown(false);
  };

  const customerHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerName(formData);
    setIsTakeAway(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSearchCountry(initialData.country);
      setSearchCity(initialData.city);
    }
  }, [initialData]);

  useEffect(() => {
    if (searchCountry && searchCountry !== formData.country) {
      handleChange("country", searchCountry);
    }
  }, [searchCountry]);

  useEffect(() => {
    if (searchCity && searchCity !== formData.city) {
      handleChange("city", searchCity);
    }
  }, [searchCity]);

  return (
    <form className="w-full min-w-full h-full" onSubmit={customerHandler}>
      <div className="flex flex-col gap-2">
        <SearchableDropdown
          label="Search Customer"
          placeholder="Enter Customer Phone Number"
          value={searchPhoneNumber}
          setValue={setSearchPhoneNumber}
          data={customerData}
          displayKey="phone"
          showDropdown={showCustomerDropDown}
          setShowDropdown={setShowCustomerDropDown}
          onSelect={(val: any) => handleSelectCustomer(val)}
          parentRef={customerRef}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="bg-gray-100 w-[80px] h-[80px] rounded-full flex items-center justify-center">
          <User size={50} color="gray" />
        </div>

        <div className="flex items-start flex-col gap-2 w-[40%]">
          <Label>Customer Name</Label>
          <Input
            type="text"
            placeholder="Enter Customer Name"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
          />
        </div>

        <div className="flex items-start flex-col gap-2 w-[40%]">
          <Label>Phone Number</Label>
          <Input type="text" placeholder="Enter Phone Number" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-4">
          <SearchableDropdown
            label="Country"
            placeholder="Search Country..."
            value={searchCountry}
            setValue={setSearchCountry}
            data={countriesData}
            displayKey="name.common"
            loading={isLoadingCountries}
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
            disabled={!formData.country}
            parentRef={cityRef}
          />

          <div className="flex items-start flex-col gap-2">
            <Label>Street</Label>
            <Input type="text" placeholder="Enter Street" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
          </div>

          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex items-start flex-col gap-2">
              <Label>Building No</Label>
              <Input
                type="text"
                placeholder="Enter Building No"
                value={formData.buildingNo}
                onChange={(e) => handleChange("buildingNo", e.target.value)}
              />
            </div>

            <div className="flex items-start flex-col gap-2">
              <Label>Floor</Label>
              <Input type="text" placeholder="Enter Floor" value={formData.floor} onChange={(e) => handleChange("floor", e.target.value)} />
            </div>

            <div className="flex items-start flex-col gap-2">
              <Label>Apartment No</Label>
              <Input
                type="text"
                placeholder="Enter Apartment No"
                value={formData.apartmentNo}
                onChange={(e) => handleChange("apartmentNo", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="text-white bg-purple-700 mt-4 dark:hover:bg-purple-900">
            Select Customer
          </Button>
        </div>
      </div>
    </form>
  );
}

export default memo(SearchCustomer);
