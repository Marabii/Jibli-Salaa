"use client";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Input from "@/components/Input";
import FormWrapper from "@/components/Form/FormWrapper";
import { LoginFormInputs, handleLoginAction } from "./Utilis/handleLoginAction";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import FormSubmissionButton from "./components/FormSubmissionButton";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations("LoginPage.Page");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const googleOAthState = { originPage: "/login", redirectTo };

  return (
    <FormWrapper<LoginFormInputs>
      action={handleLoginAction}
      redirectTo={redirectTo}
      className="w-full max-w-[550px] space-y-5 px-5"
    >
      <div>
        <label
          className="mb-2 block font-playfair text-lg font-bold"
          htmlFor="email"
        >
          {t("emailLabel")}
        </label>
        <Input
          className="w-full border-2 border-black p-5"
          type="email"
          name="email"
          label={t("emailPlaceholder")}
          labelBgColor="rgb(249 250 251)"
          required
          pattern={String(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)}
          errorMessage={t("emailError")}
        />
      </div>
      <div>
        <label
          className="mb-2 block font-playfair text-lg font-bold"
          htmlFor="password"
        >
          {t("passwordLabel")}
        </label>
        <Input
          className="w-full border-2 rounded-none border-black p-5"
          type="password"
          name="password"
          label={t("passwordPlaceholder")}
          labelBgColor="rgb(249 250 251)"
          required
          pattern={String(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)}
          errorMessage={t("passwordError")}
        />
      </div>
      <div className="flex flex-col gap-3">
        <FormSubmissionButton />
        <FormErrorHandler />
        {/* <Link
          href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${
            process.env.NEXT_PUBLIC_SERVERURL
          }/google/callback&response_type=code&client_id=1028629889843-gjkff6ielpualsk4cu1700vbp08ggacj.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline&&state=${encodeURI(
            JSON.stringify(googleOAthState)
          )}`}
          className="w-full border-2 border-black bg-black py-4 font-playfair font-bold text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          {t("signInWithGoogle")}
        </Link> */}
      </div>
      <p className="mt-5 w-full text-start text-gray-800">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="ml-5 border-b-2 border-black text-lg font-bold text-black"
        >
          {t("register")}
        </Link>
      </p>
    </FormWrapper>
  );
}
