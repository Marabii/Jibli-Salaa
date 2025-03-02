"use client";
import useErrors from "@/components/Form/useErrors";
import CustomTransition from "@/components/Transition";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function FormErrorHandler() {
  let errorMessages = useErrors();
  const t = useTranslations("FormErrorHandler");
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error") || "";
  errorMessages = oauthError ? [...errorMessages, oauthError] : errorMessages;

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessages.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [errorMessages]);

  return (
    <CustomTransition show={errorMessages.length > 0}>
      <div
        ref={errorRef}
        className="my-4 py-4 px-2 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        <h2 className="font-bold mb-2">{t("errorHeader")}</h2>
        <ul className="text-start list-inside">
          {errorMessages.map((error, index) => (
            <li key={index}>
              {error.split("\n").map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className={`${lineIndex > 0 && "ml-3"}`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {line}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </CustomTransition>
  );
}
