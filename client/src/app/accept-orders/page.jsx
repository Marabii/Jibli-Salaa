"use client";

import { useState, useEffect } from "react";
import tripsGetter from "./(utils)/tripsGetter";
import apiClient from "@/components/apiClient";
import Link from "next/link";

export default function AcceptOrders() {
  const [traveler, setTraveler] = useState(null);
  const [isTravelerLoading, setIsTravelerLoading] = useState(true);

  useEffect(() => {
    const getTraveler = async () => {
      try {
        const response = await apiClient("/api/getTraveler");
        console.log(response);
        setTraveler(response.traveler);
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    };

    getTraveler();
  }, []);

  useEffect(() => {
    console.log(traveler);
  }, [traveler]);
  return (
    <div>
      <h1>Accept Orders</h1>
      {traveler ? (
        <div>
          <p>{traveler.name}</p>
          <p>{traveler.email}</p>
          <p>{traveler.phone}</p>
        </div>
      ) : (
        <>
          <p>You haven't registered any trips yet</p>
          <Link href={"/traveler"}>Register a trip</Link>
        </>
      )}
    </div>
  );
}
