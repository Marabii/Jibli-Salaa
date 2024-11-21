"use client";

import { saveOrder, State } from "../Utilis/saveOrderAction";
import { useEffect, useState, useActionState, createContext } from "react";
import CustomTransition from "@/components/Transition";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";

interface FormWrapperProps {
  children: React.ReactNode;
}

export interface AdditionalDataContextType {
  additionalData: FormData | undefined;
  setAdditionalData: (newValue: FormData) => void;
}

export const AdditionalDataContext = createContext<AdditionalDataContextType>({
  additionalData: new FormData(),
  setAdditionalData: () => {},
});

export default function FormWrapper({ children }: FormWrapperProps) {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [additionalData, setAdditionalData] = useState<FormData>(
    new FormData()
  );
  const router = useRouter();
  const [state, formAction, pending] = useActionState<State, FormData>(
    saveOrder,
    null
  );

  //Get error messages
  useEffect(() => {
    if (state?.status === "failure" && state.errors) {
      const errors = Object.values(state.errors).filter(Boolean) as string[];
      setErrorMessages(errors);
    } else {
      setErrorMessages([]);
    }
  }, [state]);

  //Take the user to home path after successfully saving their order details.
  // useEffect(() => {
  //   if (!pending && state?.status === "success") {
  //     setTimeout(() => {
  //       router.replace("/");
  //     }, 300);
  //   }
  // }, [pending, state]);

  const handleSubmit = async (formData: FormData) => {
    const mergedData: FormData = mergeFormData(formData, additionalData);
    formAction(mergedData);
  };

  return (
    <AdditionalDataContext.Provider
      value={{ additionalData, setAdditionalData }}
    >
      <form
        action={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        {/* Form Fields */}
        {children}

        {/* Submit Button with Loading Spinner */}
        <div className="mt-6 flex items-center">
          <SubmitButton pending={pending} />
        </div>

        {/* Error Alert with Transition */}
        <CustomTransition show={errorMessages.length > 0}>
          <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h2 className="font-bold mb-2">
              There were some errors with your submission:
            </h2>
            <ul className="list-disc list-inside">
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </CustomTransition>

        {/* Success Message with Transition */}
        <CustomTransition show={state?.status === "success"}>
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Your order has been successfully placed!
          </div>
        </CustomTransition>
      </form>
    </AdditionalDataContext.Provider>
  );
}

function mergeFormData(formData1: FormData, formData2: FormData) {
  const mergedFormData = new FormData();

  // Append all entries from formData1
  for (const [key, value] of formData1.entries()) {
    mergedFormData.append(key, value);
  }

  // Append all entries from formData2
  for (const [key, value] of formData2.entries()) {
    mergedFormData.append(key, value);
  }

  return mergedFormData;
}
