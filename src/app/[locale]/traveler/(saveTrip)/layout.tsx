import MapSelectorWrapperFrom from "./Form/MapSelectorWrapperFrom";
import MapSelectorWrapperTo from "./Form/MapSelectorWrapperTo";
import TripDates from "./Form/TripDates";
import FormWrapper from "@/components/Form/FormWrapper";
import { Itinerary } from "@/interfaces/Traveler/Traveler";
import { saveItinerary } from "./Utilis/saveItineraryAction";
import FormSubmissionButton from "./Form/FormSubmissionButton";
import FormErrorHandler from "@/components/Form/FormErrorHandler";

interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "traveler",
  description:
    "This is the traveler page of the Jeebware where travelers specify the start and end locations of their trip as well as other information to include them in the algorithm",
};

export default function TravelerTripLayout() {
  return (
    <>
      <FormWrapper<Itinerary>
        action={saveItinerary}
        redirectTo="/traveler/select-trip"
        className="w-full pb-5"
      >
        <section className="flex gap-5 my-10 justify-around flex-wrap">
          <MapSelectorWrapperFrom />
          <MapSelectorWrapperTo />
        </section>
        <TripDates />
        <FormSubmissionButton />
        <section className="max-w-screen-xl mx-auto">
          <FormErrorHandler />
        </section>
      </FormWrapper>
    </>
  );
}
