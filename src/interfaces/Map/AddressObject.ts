export interface AddressObject {
  formatted_address: string;
  lat: number | null;
  lng: number | null;
  country?: string;
}
