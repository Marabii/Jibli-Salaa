import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import FormSubmissionButton from "./Utilis/FormSubmissionButton";
import { negotiationFormAction } from "./Utilis/negotiationFormAction";
import FormErrorHandler from "@/components/Form/FormErrorHandler";

type NegotiationFormProps = {
  orderId: string;
  onSuccess: () => void;
};

export interface IFinalizeNegotiations {
  actualValue: number;
  actualDeliveryFee: number;
  orderId: string;
}

export default function NegotiationForm({
  orderId,
  onSuccess,
}: NegotiationFormProps) {
  return (
    <FormWrapper
      action={negotiationFormAction}
      onSuccess={onSuccess}
      className="flex sticky flex-col space-y-3 p-4 rounded"
    >
      <Input
        className="w-full outline-none border-b-2 border-white p-4"
        type="number"
        name="actualValue"
        label="Product's Actual Value"
        labelBgColor="transparent"
        labelTextColor="white"
        required
        pattern={String(/^\d+(\.\d+)?$/)}
        errorMessage=""
      />

      <Input
        className="w-full outline-none border-b-2 border-white p-4"
        type="number"
        name="actualDeliveryFee"
        label="Agreed Upon Delivery Fee"
        labelBgColor="transparent"
        labelTextColor="white"
        required
        pattern={String(/^\d+(\.\d+)?$/)}
        errorMessage=""
      />
      <input type="hidden" name="orderId" value={orderId} />
      <FormSubmissionButton />
      <FormErrorHandler />
    </FormWrapper>
  );
}
