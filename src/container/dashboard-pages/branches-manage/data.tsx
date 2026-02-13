import { BadgeCheck, Clock, House, MessageSquareText, Phone, SquarePen, User, Users } from "lucide-react";
import { DefaultFormState, Manager } from "./SingleBranch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoundedName } from "./BranchManageCard";
import { useEffect, useRef, useState } from "react";
import { useGetCitiesMutation, useGetCountriesQuery } from "@/redux/locationApi/locationApi";
import SearchableDropdown from "@/components/SearchableDropdown";
import { Input } from "@/components/ui/input";

export const isBranchOpen = (shiftStartTime: string, shiftEndTime: string): boolean => {
  if (!shiftStartTime || !shiftEndTime) return false;

  const now = new Date();
  const [startH, startM, startS] = shiftStartTime.split(":").map(Number);
  const [endH, endM, endS] = shiftEndTime.split(":").map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, startS);

  const end = new Date(now);
  end.setHours(endH, endM, endS);

  if (end < start) end.setDate(end.getDate() + 1);

  return now >= start && now <= end;
};

export const generateBranchesIcon = (items: any[]) => {
  const totalBranch = items?.length ?? 0;

  const openBranches = items?.filter((branch) => isBranchOpen(branch.shiftStartTime, branch.shiftEndTime))?.length ?? 0;

  const newBranch = items.filter((i) => {
    if (!i.createdAt) return false;
    const joined = new Date(i.createdAt);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return joined > oneDayAgo;
  }).length;

  return [
    {
      title: "Total Branches",
      numbers: totalBranch,
      subCat: "Branches",
      icon: <House size={40} />,
      color: "bg-blue-500",
    },
    {
      title: "Open Branches",
      numbers: openBranches,
      subCat: "Branches",
      icon: <House size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Orders Today",
      numbers: 380,
      subCat: "Orders",
      icon: <MessageSquareText size={40} />,
      color: "bg-orange-500",
    },
    {
      title: "New Branches",
      numbers: newBranch,
      subCat: "Branches",
      icon: <House size={40} />,
      color: "bg-red-500",
    },
  ];
};
export interface BranchManagePrp {
  id: string;
  manager: string;
  branchName: string;
  city: string;
  phone: string | number;
  shiftStartTime: string;
  shiftEndTime: string;
  createdAt?: Date | number;
}

export function convertFirebaseDataToBranches(data: any[]): BranchManagePrp[] {
  return data?.map((single: any) => ({
    id: single?.id,
    manager: single?.manager,
    branchName: single?.branchName,
    city: single?.city,
    phone: single?.phone,
    shiftStartTime: single?.shiftStartTime,
    shiftEndTime: single?.shiftEndTime,
    createdAt: single?.createdAt,
  }));
}

export interface BranchesManagesPrp {
  icon?: React.ReactNode;
  text?: string;
  number?: number | string;
}

export function branchesManage(branchName: string, shiftStartTime: string, shiftEndTime: string, allStaff: any[]): BranchesManagesPrp[] {
  const branchStaff = allStaff.filter(
    (member) => member.branch?.id?.toLowerCase() === branchName?.toLowerCase() && member?.role?.toLowerCase() !== "admin",
  );

  const staffCount = branchStaff?.length;

  const now = new Date();
  const [startH, startM, startS] = shiftStartTime.split(":").map(Number);
  const [endH, endM, endS] = shiftEndTime.split(":").map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, startS);

  const end = new Date(now);
  end.setHours(endH, endM, endS);

  if (end < start) end.setDate(end.getDate() + 1);

  const isOpen = now >= start && now <= end;
  const branchStatus = isOpen ? "Open" : "Closed";

  return [
    {
      icon: <Users color="gray" />,
      text: "Staff",
      number: staffCount,
    },
    {
      icon: <MessageSquareText color="gray" />,
      text: "Active Orders",
      number: 10,
    },
    {
      icon: <BadgeCheck color={isOpen ? "green" : "red"} />,
      text: "Status",
      number: branchStatus,
    },
  ];
}
export const managerName = [
  { name: "Hassan Nour", value: "Hassan Nour" },
  { name: "Yousef Ahmed", value: "Yousef Ahmed" },
  { name: "Mustafa Mohammed", value: "Mustafa Mohammed" },
  { name: "Ziad Kareem", value: "Ziad Kareem" },
  { name: "Amir Ali", value: "Amir Ali" },
  { name: "Babar Hayat", value: "Babar Hayat" },
] as const;

export type ManagerName = (typeof managerName)[number]["value"];

export function staffAndBranchData(staffCount: number, shiftStartTime?: string, shiftEndTime?: string) {
  if (!shiftStartTime || !shiftEndTime) {
    return [
      {
        icon: <Users color="gray" size={50} />,
        text: "Staff",
        number: staffCount,
      },
      {
        icon: <MessageSquareText color="gray" size={50} />,
        text: "Active Orders",
        number: 190,
      },
      {
        icon: <BadgeCheck color="gray" size={50} />,
        text: "Status",
        number: "Closed",
      },
    ];
  }

  const now = new Date();
  const [startH, startM, startS] = shiftStartTime.split(":").map(Number);
  const [endH, endM, endS] = shiftEndTime.split(":").map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, startS);

  const end = new Date(now);
  end.setHours(endH, endM, endS);

  if (end < start) end.setDate(end.getDate() + 1);

  const isOpen = now >= start && now <= end;
  const branchStatus = isOpen ? "Open" : "Closed";

  return [
    {
      icon: <Users color="gray" size={50} />,
      text: "Staff",
      number: staffCount,
    },
    {
      icon: <MessageSquareText color="gray" size={50} />,
      text: "Active Orders",
      number: 190,
    },
    {
      icon: <BadgeCheck color={!isOpen ? "red" : "green"} size={50} />,
      text: "Status",
      number: branchStatus,
    },
  ];
}

export interface BranchProfileProps {
  manager: Manager;
  formatTime: (time?: string) => string;
  setIsBranchId?: React.Dispatch<React.SetStateAction<string | null>>;
  branchName?: string | null;
}

export const BranchProfile = ({ manager, formatTime, setIsBranchId, branchName }: BranchProfileProps) => {
  const basicInfo = [
    {
      icon: <User className="text-gray-700 dark:text-white" />,
      label: "Manager",
      title: manager.name ?? "-",
    },
    {
      icon: <Phone className="text-gray-700 dark:text-white" />,
      label: "Phone",
      title: manager.phone ?? "-",
    },
    {
      icon: <Clock className="text-gray-700 dark:text-white" />,
      label: "Work Time",
      title: `${formatTime(manager.shiftStartTime) || "00"} to ${formatTime(manager.shiftEndTime) || "00"} `,
    },
  ];

  return (
    <Card>
      <CardContent>
        <CardHeader className="px-0">
          <div className="flex flex-row items-start justify-between gap-4 sm:gap-0">
            {/* Left: Avatar + Info */}
            <div className="flex flex-row items-center gap-4 sm:gap-6 w-full">
              <RoundedName className="!w-[80px] !h-[80px] sm:!w-[90px] sm:!h-[90px] text-xl">
                {(branchName || manager.branch?.name)
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase() || "?"}
              </RoundedName>

              <div className="flex flex-col text-center sm:text-left">
                <h4 className="text-black dark:text-gray-100 font-semibold text-lg sm:text-xl">{branchName || manager.branch?.name}</h4>
                <p className="text-gray-400 text-sm">{manager.city ?? "-"}</p>
              </div>
            </div>

            {/* Edit Button */}
            <SquarePen
              color="black"
              size={22}
              className="cursor-pointer hidden sm:block dark:stroke-white"
              onClick={() => manager?.id && setIsBranchId?.(manager.id)}
            />

            {/* Mobile Edit Button */}
            <SquarePen
              color="black"
              size={22}
              className="dark:stroke-white cursor-pointer sm:hidden mt-2"
              onClick={() => manager?.id && setIsBranchId?.(manager.id)}
            />
          </div>
        </CardHeader>

        {/* Basic Info */}
        <p className="text-gray-500 dark:text-amber-400 text-sm mt-3 max-[640px]:text-center">Basic information:</p>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-0 text-center sm:text-left">
          {basicInfo.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-1 sm:gap-2">
              {item.icon}
              <span className="text-sm text-gray-700 dark:text-white">{item.label}:</span>
              <p className="text-black font-semibold text-sm dark:text-gray-300 dark:font-normal">{item.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export interface BranchesModalItemsPrp {
  formData: DefaultFormState;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const SingleBranchModal: React.FC<BranchesModalItemsPrp> = ({ formData, setFormData }) => {
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
    setFormData({ ...formData, city: cityName });
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
