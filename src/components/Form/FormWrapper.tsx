"use client";

import React, { useEffect, useState, createContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ActionReturn,
  AdditionalDataContextType,
  FormWrapperProps,
} from "@/interfaces/Form/Form";
import { Errors } from "@/interfaces/Errors/errors";
import { useActionState } from "react";

// Initialize the context with the combined ActionReturn
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
  className,
}: FormWrapperProps<T>) {
  const router = useRouter();
  const [additionalData, setAdditionalData] = useState<FormData>(
    new FormData()
  );

  // Local state for client-side errors
  const [localActionReturn, setLocalActionReturn] = useState<
    ActionReturn<T> | undefined
  >(undefined);

  const [actionReturn, formAction, pending] = useActionState<
    ActionReturn<T>,
    FormData
  >(action, null);

  // Redirect user to another directory upon successful server action
  useEffect(() => {
    if (!pending && actionReturn?.status === "success" && redirectTo) {
      console.log("rerouting the user...");
      router.replace(redirectTo);
    }
  }, [pending, actionReturn, redirectTo, router]);

  // Combine server and client action returns, prioritizing client errors
  const combinedActionReturn: ActionReturn<T> = mergeActionReturns(
    actionReturn,
    localActionReturn
  );

  const handleSubmit = async (formData: FormData) => {
    // Reset local errors before validation
    setLocalActionReturn({
      status: "success",
      data: {} as T,
      errors: undefined,
    });

    const mergedData: FormData = mergeFormData(formData, additionalData);
    const sizeInMB = getFormDataSizeInMB(mergedData);

    if (sizeInMB > 5) {
      // Set client-side error without sending data to the backend
      setLocalActionReturn({
        status: "failure",
        data: {} as T,
        errors: {
          global: "Images are too large. Maximum allowed size is 5MB.",
        } as Errors<T>, // Explicitly cast to Errors<T>
      });
      return;
    }

    // Proceed with the form action if size is acceptable
    formAction(mergedData);
  };

  const addAdditionalData = useCallback((formData: FormData) => {
    setAdditionalData((prev) => mergeFormData(prev, formData, true));
  }, []);

  return (
    <AdditionalDataContext.Provider
      value={{
        additionalData,
        addAdditionalData,
        actionReturn: combinedActionReturn,
        pending,
      }}
    >
      <form
        action={handleSubmit}
        className={
          className || "max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
        }
      >
        {children}
      </form>
    </AdditionalDataContext.Provider>
  );
}

function mergeFormData(
  initialFormData: FormData,
  newFormData: FormData,
  overwriteExisting: boolean = false
): FormData {
  const mergedFormData = new FormData();

  // Append all entries from initialFormData
  for (const [key, value] of initialFormData.entries()) {
    mergedFormData.append(key, value);
  }

  // Iterate through newFormData
  for (const [key, value] of newFormData.entries()) {
    if (overwriteExisting) {
      // Use 'set' to overwrite existing keys
      mergedFormData.set(key, value);
    } else {
      // Append normally, allowing duplicate keys
      mergedFormData.append(key, value);
    }
  }

  return mergedFormData;
}

function mergeActionReturns<T>(
  actionReturn: ActionReturn<T>,
  localActionReturn: ActionReturn<T> | undefined
): ActionReturn<T> {
  if (!localActionReturn) {
    return actionReturn;
  }

  if (!actionReturn && localActionReturn) {
    return localActionReturn;
  }

  if (!actionReturn) {
    return null;
  }

  // If localActionReturn has errors undefined, it means errors have been reset
  const errors = {
    ...(actionReturn.errors || {}),
    ...(localActionReturn.errors || {}),
  };

  const status =
    actionReturn.status === "failure" || localActionReturn.status === "failure"
      ? "failure"
      : "success";

  const returnObj: ActionReturn<T> = {
    status: status,
    errors: errors as Errors<T>,
    data: { ...actionReturn.data, ...localActionReturn.data },
  };

  return returnObj;
}

function getFormDataSizeInMB(formData: FormData) {
  let totalSize = 0;

  // Iterate through each entry in the FormData
  for (let entry of formData.entries()) {
    const [_, value] = entry;

    if (value instanceof File) {
      // If the value is a File, use its size property
      totalSize += value.size;
    } else {
      // If it's a string, calculate its size in bytes
      totalSize += new Blob([value]).size;
    }
  }

  // Convert bytes to megabytes and return the result
  return totalSize / (1024 * 1024);
}
