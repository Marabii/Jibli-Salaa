import apiClient from "@/components/apiClient";

export default async function OrdersGetter() {
  try {
    const response = await apiClient("/api/getOrders");
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}
