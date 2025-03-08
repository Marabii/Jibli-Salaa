import { CompletedOrder } from "@/interfaces/Order/order";

// Approximate radius of Earth in kilometers
const EARTH_RADIUS_KM = 6371;

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;
  const dLat = toRadian(lat2 - lat1);
  const dLng = toRadian(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(lat1)) *
      Math.cos(toRadian(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function findCenterOfLargestCluster(
  orders: CompletedOrder[],
  radiusInKm = 5
): { lat: number; lng: number } | null {
  const points = orders
    .map((o) => o.preferredPickupPlace)
    .filter((place) => place && place.lat !== null && place.lng !== null) as {
    lat: number;
    lng: number;
  }[];

  if (points.length === 0) {
    return null;
  }

  let largestCluster: { lat: number; lng: number }[] = [];

  for (const point of points) {
    const cluster: { lat: number; lng: number }[] = [];
    for (const other of points) {
      const dist = haversineDistance(
        point.lat,
        point.lng,
        other.lat,
        other.lng
      );
      if (dist <= radiusInKm) {
        cluster.push(other);
      }
    }

    if (cluster.length > largestCluster.length) {
      largestCluster = cluster;
    }
  }

  if (largestCluster.length === 0) {
    return null;
  }

  const sumLat = largestCluster.reduce((sum, p) => sum + p.lat, 0);
  const sumLng = largestCluster.reduce((sum, p) => sum + p.lng, 0);

  return {
    lat: sumLat / largestCluster.length,
    lng: sumLng / largestCluster.length,
  };
}
