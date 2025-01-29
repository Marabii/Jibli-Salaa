import { Errors } from "@/interfaces/Errors/errors";
import { RegisterFormInputs, RegisterResponse } from "./handleRegisterAction";
import { ApiResponse, ApiStatus } from "@/interfaces/Apis/ApiResponse";

export const handleRegisterSubmit = async (
  data: RegisterFormInputs
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const responseData: ApiResponse<RegisterResponse> = await response.json();

    if (!response.ok) {
      const errorMessage = responseData?.message || "An unknown error occurred";
      const errorsArray = responseData?.errors || [];
      const formattedErrors = errorsArray
        .map((error) => `● ${error}`)
        .join(",\n");

      throw new Error(errorMessage + "\n" + formattedErrors);
    }

    if (responseData.status !== ApiStatus.SUCCESS) {
      throw new Error(`Registering unsuccessful: ${responseData.message}`);
    }

    return responseData.data;
  } catch (error) {
    throw error;
  }
};

export const getRegisterForm = (formData: FormData): RegisterFormInputs => {
  return {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
    spokenLanguages: JSON.parse(
      formData.get("spokenLanguages")?.toString() || "{}"
    ),
  };
};

export type ValidateFormResponse = {
  isError: boolean;
  errors: Errors<RegisterFormInputs>;
};

export const validateForm = ({
  name,
  email,
  password,
  phoneNumber,
  spokenLanguages,
}: RegisterFormInputs): ValidateFormResponse => {
  const errors: Errors<RegisterFormInputs> = {};

  const emailRegexGrp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegexGrp =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
  const nameRegexGrp = /^[\p{L} ]+$/u; // Corrected regex
  const phoneRegexGrp = /^[0-9]{10,15}$/;

  // Validate name
  if (!name) {
    errors.name = "Name is missing";
  } else if (!nameRegexGrp.test(name)) {
    errors.name = "Name contains invalid characters";
  }

  // Validate email
  if (!email) {
    errors.email = "Email is missing";
  } else if (!emailRegexGrp.test(email)) {
    errors.email = "Invalid email address";
  }

  // Validate password
  if (!password) {
    errors.password = "Password is missing";
  } else if (!passwordRegexGrp.test(password)) {
    errors.password =
      "Password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, one digit, and one special character.";
  }

  // Validate phoneNumber
  if (!phoneNumber) {
    errors.phoneNumber = "Phone number is missing";
  } else if (!phoneRegexGrp.test(phoneNumber)) {
    errors.phoneNumber =
      "Phone number must be between 10 and 15 digits and contain only numbers";
  }

  // Validate spokenLanguages
  if (!spokenLanguages || spokenLanguages.length === 0) {
    errors.spokenLanguages = "Please select at least 1 language that you speak";
  }

  const isError = Object.keys(errors).length > 0;

  return {
    isError,
    errors,
  };
};
