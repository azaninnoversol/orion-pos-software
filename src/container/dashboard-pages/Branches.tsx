"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

//components
import { Button } from "@/components/ui/button";
import SearchableDropdown from "@/components/SearchableDropdown";
import { Input } from "@/components/ui/input";
import CustomModal from "@/components/CustomModal";
import Loading from "@/app/loading";
import { MenuCard } from "./menu/MenuCard";

//helper-function
import { convertFirebaseDataToBranches, generateBranchesIcon } from "./branches-manage/data";
import BranchManageCard from "./branches-manage/BranchManageCard";
import { toast } from "sonner";
import { branchManageService, staffManageService } from "@/services/api_service";
import { useGetCitiesMutation, useGetCountriesQuery } from "@/redux/locationApi/locationApi";

//icons
import { Phone, Plus, Search } from "lucide-react";

export interface DefaultFormState {
  country: string;
  branchName: string;
  city: string;
  phone: string | number;
  shiftStartTime: string;
  shiftEndTime: string;
  managerId?: string;
}

const defaultForm: DefaultFormState = {
  country: "",
  branchName: "",
  city: "",
  phone: "",
  shiftStartTime: "",
  shiftEndTime: "",
  managerId: "",
};

function Branches() {
  const [filterValue, setFilterValue] = useState<string>("");
  const [isOpenBranchModal, setIsOpenBranchModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [data, setData] = useState<DefaultFormState[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "fetching" | "fetched" | "fetchingID" | "fetchedID">("idle");

  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void) => {
    try {
      setStatus("fetching");
      await fn();
      setStatus("fetched");
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong!");
      setStatus("error");
    }
  }, []);

  const fetchBranchesData = useCallback(
    () =>
      safeAsync(async () => {
        const userId = localStorage.getItem("USER_ID");
        const res = await branchManageService.getAll();
        if (res) {
          const filtered = res.filter((branch: DefaultFormState) => branch.managerId === userId);
          setData(filtered);
        }
      }),
    [safeAsync],
  );

  const fetchManageService = useCallback(
    () =>
      safeAsync(async () => {
        const allStaff = await staffManageService.getAll();
        if (allStaff) {
          setStaffData(allStaff);
        }
      }),
    [safeAsync],
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const branchDataWithManager = {
      ...formData,
      managerId: localStorage.getItem("USER_ID"),
    };

    const isAllFieldEmpty = Object.values(branchDataWithManager).some((val) => val === "" || val === null || val === undefined);

    if (!branchDataWithManager.city || branchDataWithManager.city.trim() === "") {
      branchDataWithManager.city = "N/A";
    }

    if (isAllFieldEmpty) {
      toast.error("Please fill all fields before submitting!");
      return;
    }

    setStatus("saving");

    try {
      const res = await branchManageService.add(branchDataWithManager as any);

      if (res) {
        toast.success("Branch Created Successfully!");
        setIsOpenBranchModal(false);
        await fetchBranchesData();
        setFormData(defaultForm);
        setStatus("fetched");
      } else {
        toast.error("Something went wrong! Please try again.");
        setStatus("error");
      }
    } catch (err: any) {
      toast.error(err instanceof Error ? `Error: ${err.message}` : "Unexpected error occurred");
      setStatus("error");
    } finally {
      setStatus("idle");
    }
  };

  useEffect(() => {
    fetchBranchesData();
    fetchManageService();
  }, [fetchBranchesData, fetchManageService]);

  const branchData = convertFirebaseDataToBranches(data);
  const branchesItems = generateBranchesIcon(branchData);

  const filteredAndSortedData = useMemo(() => {
    let filtered = branchData;
    if (filterValue.trim()) {
      const lowerValue = filterValue.toLowerCase();
      filtered = branchData.filter((item: any) => Object.values(item).some((val) => String(val).toLowerCase().includes(lowerValue)));
    }
    return filtered;
  }, [branchData, filterValue]);

  const deleteBranchHandler = async (id: string) => {
    setStatus("fetchingID");
    try {
      await branchManageService.deleteById(id);
      toast.success("Branch Delete Successfully!");
      await fetchBranchesData();
      setStatus("idle");
    } catch (error) {
      setStatus("idle");
      toast.error(`Error : ${error instanceof Error}`);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section id="staff" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between flex-wrap max-[485px]:justify-center max-[485px]:gap-2">
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl whitespace-nowrap text-black dark:text-gray-200">Manage Your Branches</h3>

          <div className="flex gap-4 items-center">
            <Button className="rounded-sm !bg-[#3238a1] !text-white" onClick={() => setIsOpenBranchModal?.(true)}>
              <Plus />
              <span>Add New Branch</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-8">
          {branchesItems.map((item, idx) => (
            <MenuCard {...item} key={idx} />
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 flex-wrap max-[518px]:justify-center max-[518px]:gap-2">
          <h2 className="text-3xl font-semibold text-black dark:text-gray-100">Branches</h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center relative">
              <Search className="absolute left-2" color="#828282" />
              <Input
                placeholder="Search"
                className="pl-9 font-medium text-black dark:text-gray-200 bg-gray-200 rounded-sm border-2 h-[40px]"
                onChange={handleFilterChange}
                value={filterValue}
              />
            </div>
          </div>
        </div>

        <>
          {status === "fetching" || status === "fetchingID" ? (
            <Loading className="!min-h-[500px]" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {!filteredAndSortedData?.length ? (
                <p className="text-center text-gray-600 dark:text-gray-200 text-sm w-full col-span-3">No results.</p>
              ) : (
                filteredAndSortedData?.map((single, idx) => (
                  <BranchManageCard allStaff={staffData} deleteBranchHandler={deleteBranchHandler} {...single} key={idx} />
                ))
              )}
            </div>
          )}
        </>

        <CustomModal
          className="min-w-[25%]"
          open={isOpenBranchModal}
          setOpen={() => {
            setFormData(defaultForm);
            setIsOpenBranchModal?.(false);
          }}
          header={<span className="text-xl font-semibold">Add New Branch</span>}
        >
          <form className="flex items-center justify-start flex-col w-full gap-4 relative" onSubmit={onSubmit}>
            {status === "fetching" ? (
              <Loading className="!min-h-[500px]" />
            ) : (
              <>
                <BranchesModalItems formData={formData} setFormData={setFormData} />

                <Button
                  type="submit"
                  className="w-full bg-[#3238a1] hover:dark:bg-[#3238a1] dark:text-gray-200 flex items-center justify-center gap-2"
                >
                  {status === "saving" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <span>Add Branch</span>
                  )}
                </Button>
              </>
            )}
          </form>
        </CustomModal>
      </main>
    </section>
  );
}

export default React.memo(Branches);

interface BranchesModalItemsPrp {
  formData: DefaultFormState;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BranchesModalItems: React.FC<BranchesModalItemsPrp> = ({ formData, setFormData }) => {
  const [searchCountry, setSearchCountry] = useState(formData.country || "");
  const [searchCity, setSearchCity] = useState(formData.city || "");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citiesData, setCitiesData] = useState<string[]>([]);

  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const { data: countriesData = [], isLoading } = useGetCountriesQuery(searchCountry);

  const [getCities, { isLoading: isFetchingCities }] = useGetCitiesMutation();

  const handleSelectCountry = async (countryName: string) => {
    setFormData({ ...formData, country: countryName, city: "" });
    setSearchCountry(countryName);
    setShowCountryDropdown(false);
    setCitiesData([]);
    setSearchCity("");

    try {
      const response = await getCities({ country: countryName }).unwrap();
      setCitiesData(response?.data || []);
    } catch {
      setCitiesData([]);
    }
  };

  const handleSelectCity = (cityName: string) => {
    setFormData({ ...formData, city: cityName || searchCity });
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
    if (formData.country) setSearchCountry(formData.country);
    if (formData.city) setSearchCity(formData.city);
  }, [formData.country, formData.city]);

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Branch Name</label>
        <Input
          type="text"
          placeholder="Branch Name"
          value={formData.branchName ?? ""}
          onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

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
        onSelect={(country: any) => handleSelectCountry(country.name.common)}
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
        disabled={!formData.country || !searchCountry}
        parentRef={cityRef}
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Phone Number</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-sm">+</span>
          </div>
          <Input
            type="number"
            placeholder="Phone Number"
            value={formData.phone ?? ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-12 border-gray-300 focus-visible:ring-[#3238a1]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Start Time</label>
        <Input
          type="time"
          step="1"
          value={formData.shiftStartTime ?? ""}
          onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      {/* End Time */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">End Time</label>
        <Input
          type="time"
          step="1"
          value={formData.shiftEndTime ?? ""}
          onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>
    </>
  );
};
