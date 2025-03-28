import FormWrapper from "@/components/Form/FormWrapper";
import { InitialOrder } from "@/interfaces/Order/order";
import { saveOrder } from "./Utilis/saveOrderAction";
import FormMapInput from "./Form/FormMapinput";
import FormUsualInputs from "./Form/FormUsualInputs";
import FormImagesInput from "./Form/FormImagesInput";
import FormSubmissionButton from "./Form/FormSubmissionButton";
import FormErrorHandler from "@/components/Form/FormErrorHandler";

interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Buyer Page",
  description:
    "This is the buyers page designed to help users place orders in the Jeebware website. Travelers can then accept those orders and hand deliver them to their destinations.",
};

export default function BuyerLayout() {
  return (
    <>
      <FormWrapper<InitialOrder>
        className="relative z-0 my-5 mx-auto w-full max-w-screen-2xl p-6 bg-white rounded-lg shadow-md"
        action={saveOrder}
        redirectTo="/buyer/manage-orders"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormUsualInputs />
          <div className="flex w-full flex-col mx-auto">
            <FormMapInput />
            <FormImagesInput />
          </div>
        </div>
        <FormErrorHandler />
        <FormSubmissionButton />
      </FormWrapper>
    </>
  );
}
