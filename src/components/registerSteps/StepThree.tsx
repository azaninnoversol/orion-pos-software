"use client";
import React, { useRef, useState } from "react";

// animations
import { motion } from "framer-motion";

// components
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import FormInput from "./FormInput";
import DatePicker from "../DatePicker";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// helper
import { cn, plans } from "@/lib/utils";

// icons
import { Camera, CreditCard } from "lucide-react";

// redux
import { useGetCountriesQuery } from "@/redux/locationApi/locationApi";

export interface Plan {
  title: string;
  price: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}

interface StepThreeProps {
  FormData: {
    card_number?: number | string;
    card_cvc?: number | string;
    card_date?: Date | number | string;
    country?: string;
    zipCode?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ FormData, handleChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const { data: countriesData = [], isLoading } = useGetCountriesQuery(searchCountry);

  const filteredCountries = searchCountry ? countriesData.slice(0, 10) : [];

  const [planForms, setPlanForms] = useState({
    silver: { card_number: "", card_cvc: "", card_date: "" },
    gold: { card_number: "", card_cvc: "", card_date: "" },
    platinum: { card_number: "", card_cvc: "", card_date: "" },
  });

  const modalOpenHandler = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const getPlanKey = (title: string) => title.toLowerCase() as keyof typeof planForms;

  const handleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPlan) return;
    const planKey = getPlanKey(selectedPlan.title);

    const { name, value } = e.target;

    setPlanForms((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        [name]: value,
      },
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!selectedPlan) return;
    const planKey = getPlanKey(selectedPlan.title);
    setPlanForms((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        card_date: date ? date.toISOString() : "",
      },
    }));
  };

  const confirmBtnHandler = () => {
    if (!selectedPlan) return;
    const planKey = getPlanKey(selectedPlan.title);
    const selectedData = planForms[planKey];

    Object.entries(selectedData).forEach(([key, value]) => {
      handleChange({
        target: { name: key, value: value },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    setOpen(false);
  };

  const handleSelectCountry = async (countryName: string) => {
    handleChange({
      target: { name: "country", value: countryName },
    } as React.ChangeEvent<HTMLInputElement>);

    setSearchCountry(countryName);
    setShowCountryDropdown(false);
  };

  const isFormComplete =
    selectedPlan &&
    planForms[getPlanKey(selectedPlan.title)].card_number.trim() !== "" &&
    planForms[getPlanKey(selectedPlan.title)].card_cvc.trim() !== "" &&
    planForms[getPlanKey(selectedPlan.title)].card_date !== "" &&
    FormData.country &&
    FormData.zipCode &&
    isTermsAccepted;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {plans.map((plan, idx) => (
          <PaymentCard key={idx} {...plan} onChoose={() => modalOpenHandler(plan)} />
        ))}
      </div>

      <OpenPlanDialog open={open} isFormComplete={!!isFormComplete} setOpen={setOpen} selectedPlan={selectedPlan} onConfirm={confirmBtnHandler}>
        {selectedPlan && (
          <main>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Card Information</p>
              <p className="flex items-center gap-2 text-black">
                <Camera size={20} />
                <span>Scan Card</span>
              </p>
            </div>

            <div className="flex items-center w-full justify-between relative">
              <FormInput
                name="card_number"
                placeholder="Card Number"
                value={planForms[getPlanKey(selectedPlan.title)].card_number}
                onChange={handleChangeHandler}
                custom={4}
                className="w-full"
              />
              <CreditCard className="text-gray-300 absolute right-3 bottom-1.5" />
            </div>

            <div className="flex w-full items-center justify-between">
              <DatePicker
                className="w-[50%] mt-2"
                classNameBtn="rounded-r-[0px]"
                value={
                  planForms[getPlanKey(selectedPlan.title)].card_date ? new Date(planForms[getPlanKey(selectedPlan.title)].card_date) : undefined
                }
                onChange={handleDateChange}
              />
              <div className="w-[50%] relative">
                <FormInput
                  name="card_cvc"
                  placeholder="CVC"
                  value={planForms[getPlanKey(selectedPlan.title)].card_cvc}
                  onChange={handleChangeHandler}
                  custom={4}
                  className="w-full border-l-transparent rounded-l-[0px] focus-visible:ring-transparent"
                />
                <CreditCard className="text-gray-300 absolute right-3 bottom-1.5" />
              </div>
            </div>
          </main>
        )}

        <main>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Country or Region</p>
          </div>

          <div className="flex flex-col gap-2 relative mt-1" ref={countryRef}>
            <input
              type="text"
              placeholder="Type country name..."
              value={FormData.country || searchCountry}
              onChange={(e) => {
                setSearchCountry(e.target.value);
                setShowCountryDropdown(true);
              }}
              onFocus={() => {
                if (filteredCountries.length > 0) setShowCountryDropdown(true);
              }}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#3238a1]"
            />

            {isLoading && <p className="text-sm text-gray-400 mt-1">Loading...</p>}

            {showCountryDropdown && searchCountry && filteredCountries.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
                {filteredCountries.map((country, index) => (
                  <div key={index} onClick={() => handleSelectCountry(country.name.common)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                    {country.name.common}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormInput
            name="zipCode"
            placeholder="Enter zip code"
            value={FormData.zipCode || ""}
            onChange={handleChange}
            disabled={!FormData.country}
          />

          <div className="flex items-center gap-3 pt-4">
            <Checkbox id="terms" className="cursor-pointer" checked={isTermsAccepted} onCheckedChange={(checked) => setIsTermsAccepted(!!checked)} />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </main>
      </OpenPlanDialog>
    </motion.div>
  );
};

export default React.memo(StepThree);

interface PaymentCardProps {
  title: string;
  price: string;
  features: string[];
  gradient: string;
  popular?: boolean;
  onChoose?: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ title, price, features, gradient, popular, onChoose }) => {
  return (
    <Card
      className={cn(
        "relative w-full sm:w-[48%] lg:w-[32%] rounded-2xl p-5 shadow-md transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-lg text-gray-800",
        gradient,
      )}
    >
      {popular && <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Most Popular</span>}

      <CardHeader className="font-semibold text-2xl text-center">{title}</CardHeader>

      <CardContent className="flex flex-col items-center gap-3 px-0">
        <p className="text-3xl font-bold">{price}</p>
        <ul className="text-sm space-y-2 w-full">
          {features.map((item, index) => (
            <li key={index}>✅ {item}</li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button type="button" onClick={onChoose} className="mt-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          Buy Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

interface OpenPlanDialogProps {
  open: boolean;
  isFormComplete?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPlan: Plan | null;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

const OpenPlanDialog: React.FC<OpenPlanDialogProps> = ({ open, isFormComplete, setOpen, selectedPlan, onConfirm, children }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-purple-700">
            {selectedPlan ? `Choose the ${selectedPlan.title} Plan` : "Choose Plan"}
          </DialogTitle>
        </DialogHeader>

        {children}

        <DialogFooter className="flex justify-center mt-4">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!isFormComplete}
            className={cn("text-white transition-colors", isFormComplete ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed")}
          >
            Confirm Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
