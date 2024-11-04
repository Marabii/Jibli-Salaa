import type { AddressObject } from "../Map/AddressObject";

export interface TravelerTripState {
  value: {
    from: AddressObject;
    to: AddressObject;
    departure: string;
    arrival: string;
  };
}
