// "use client";
// import apiClient from "@/utils/apiClient";
// import { ChangeEvent, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// export default function SendData() {

//   // Local state to store selected files
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const router = useRouter();

//   // State to store validation errors
//   const [validationErrors, setValidationErrors] = useState<{
//     [key: string]: string;
//   }>({});

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">

//       {/* Display validation errors for other fields if any */}
//       {Object.keys(validationErrors).map((key) => {
//         if (key === "images") return null; // Already displayed above
//         return (
//           <p key={key} className="text-red-500 text-sm">
//             {validationErrors[key]}
//           </p>
//         );
//       })}

//     </form>
//   );
// }
