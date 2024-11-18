import FormWrapper from "./Form/FormWrapper";
import FormDetails from "./Form/FormDetails";
import MapSelectorWrapper from "./Components/MapSelectorWrapper";
import FormImages from "./Form/FormImages";

interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Buyer Page",
  description:
    "This is the buyers page designed to help users place orders in the Jiblii Salaa website. Travelers can then accept those orders and hand deliver them to their destinations.",
};

export default function BuyerLayout() {
  return (
    <>
      <FormWrapper>
        <FormDetails
          MapComponent={MapSelectorWrapper}
          FormImages={FormImages}
        />
      </FormWrapper>
    </>
  );
}
