"use client";

import React, {
  useEffect,
  useState,
  useActionState,
  createContext,
} from "react";
import { useRouter } from "next/navigation";
import {
  ActionReturn,
  AdditionalDataContextType,
  FormWrapperProps,
} from "@/interfaces/Form/Form";

export const AdditionalDataContext = createContext<
  AdditionalDataContextType<any>
>({
  additionalData: new FormData(),
  addAdditionalData: (formData: FormData) => {},
  actionReturn: {} as ActionReturn<any>,
  pending: false,
});

export default function FormWrapper<T>({
  children,
  action,
  redirectTo,
}: FormWrapperProps<T>) {
  const router = useRouter();
  const [additionalData, setAdditionalData] = useState<FormData>(
    new FormData()
  );
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturn<T>,
    FormData
  >(action, null);

  //redirect user to another directory
  useEffect(() => {
    if (!pending && actionReturn?.status === "success" && redirectTo) {
      router.replace(redirectTo);
    }
  }, [pending, actionReturn]);

  const handleSubmit = async (formData: FormData) => {
    const mergedData: FormData = mergeFormData(formData, additionalData);
    formAction(mergedData);
  };

  const addAdditionalData = (formData: FormData) => {
    setAdditionalData(mergeFormData(formData, additionalData));
  };

  return (
    <AdditionalDataContext.Provider
      value={{ additionalData, addAdditionalData, actionReturn, pending }}
    >
      <form
        action={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        {children}
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
