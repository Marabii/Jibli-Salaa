import { Itinerary } from "../Map/Itinerary";
import { TRAVELER_STATUS } from "./TRAVELER_STATUS";

export interface Traveler {
  travelerId: string;
  itinerary: Itinerary;
  travelerStatus: TRAVELER_STATUS;
  _id: string;
}
