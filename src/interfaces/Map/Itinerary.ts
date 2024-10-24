import { AddressObject } from "./AddressObject";

export interface Itinerary {
  from: AddressObject;
  to: AddressObject;
  departure: Date;
  arrival: Date;
}
