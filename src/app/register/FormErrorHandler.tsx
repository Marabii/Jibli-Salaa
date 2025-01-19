"use client";

import useErrors from "@/components/Form/useErrors";
import CustomTransition from "@/components/Transition";

export default function FormErrorHandler() {
  const errorMessages = useErrors();

  return (
    <>
      {/* Error Alert with Transition */}
      <CustomTransition show={errorMessages.length > 0}>
        <div className="my-4 py-4 px-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold mb-2">
            There were some errors with your submission:
          </h2>
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
    </>
  );
}
