"use client";
import { useEffect, useState } from "react";
import Dropdown from "@/components/DropDown";
import MapWithAutocomplete from "../(components)/Map";

export default function TravelerPageForm() {
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [spokenLanguages, setSpokenLanguages] = useState([]);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const data = await fetch("/languages.json");
        const languages = await data.json();
        setLanguages(languages);
      } catch {
        console.log("error");
      }
    };
    getLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(location1, location2, spokenLanguages);
  };

  return (
    <>
      <h2>Enter the start location of your trip</h2>
      <MapWithAutocomplete setLocation={setLocation1} />
      <h2>Enter your destination</h2>
      <MapWithAutocomplete setLocation={setLocation2} />

      <div className="p-5">
        <h1 className="mb-4">Custom Dropdown with Tailwind CSS</h1>
        <Dropdown
          multiple={true}
          label="Select which languages you speak"
          options={languages?.map((lang) => ({
            label: lang.nativeName,
            value: lang.code,
          }))}
          selected={spokenLanguages}
          onSelect={setSpokenLanguages}
        />
        {languages && spokenLanguages.length !== 0 && (
          <div className="mt-4">
            You selected:{" "}
            <ul>
              {spokenLanguages.map((lang) => (
                <li key={lang.label}>{lang.label}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
