import { twMerge } from "tailwind-merge";

export default function SubmitButton({
  pending,
  className,
}: {
  pending: boolean;
  className: string;
  defaultText: string;
  pendingText: string;
}) {
  console.log("pending: ", pending);
  return (
    <button
      type="submit"
      className={twMerge(
        className ||
          "flex items-center justify-center font-bold py-2 px-4 rounded",
        pending ? "opacity-50 cursor-not-allowed" : ""
      )}
      disabled={pending}
    >
      {pending && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      )}
      {pending ? "Sending..." : "Send Data"}
    </button>
  );
}
