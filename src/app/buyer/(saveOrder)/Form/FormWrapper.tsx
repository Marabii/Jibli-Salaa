"use client";

import { saveOrder, State } from "../utils/saveOrderAction";
import { useActionState } from "react";

interface FormWrapperProps {
  children: React.ReactNode;
}

export default function FormWrapper({ children }: FormWrapperProps) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    saveOrder,
    null
  );

  return (
    <form
      action={formAction}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {children}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send Data
      </button>
      {pending && "still loading data"}
      {state && JSON.stringify(state)}
    </form>
  );
}
