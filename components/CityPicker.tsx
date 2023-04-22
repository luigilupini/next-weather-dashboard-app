'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Country, City } from 'country-state-city';
import Select from 'react-select';

import { GlobeIcon } from '@heroicons/react/solid';

// A `type` is a way to define a custom type in TypeScript. Here, we're defining
// a type called `option` that is either `null` or an object with this shape.
type option = {
  value: {
    latitude: string;
    longitude: string;
    isoCode: string;
  };
  label: string;
} | null;

type cityOption = {
  value: {
    latitude: string;
    longitude: string;
    countryCode: string;
    name: string;
    stateCode: string;
  };
  label: string;
} | null;

function options() {
  const options = Country.getAllCountries().map((country) => ({
    value: {
      latitude: country.latitude,
      longitude: country.longitude,
      isoCode: country.isoCode,
    },
    label: country.name,
  }));
  return options;
}

function cityOptions(country: option) {
  const options = City.getCitiesOfCountry(
    country?.value.isoCode as string
  )?.map((state) => ({
    value: {
      latitude: state.latitude!,
      longitude: state.longitude!,
      countryCode: state.countryCode,
      name: state.name,
      stateCode: state.stateCode,
    },
    label: state.name,
  }));
  return options;
}

export default function CityPicker() {
  const [selectedCountry, setSelectedCountry] = useState<option>(null);
  const [selectedCity, setSelectedCity] = useState<cityOption>(null);

  const router = useRouter();

  const handleSelectedCountry = (option: option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option: cityOption) => {
    setSelectedCity(option);
    router.push(
      `/location/${option?.value.latitude}/${option?.value.longitude}`
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          <GlobeIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <label htmlFor="country">Country</label>
        </div>
        <Select
          className="text-black"
          options={options()}
          onChange={handleSelectedCountry}
          value={selectedCountry}
        />
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/80">
            <GlobeIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <label htmlFor="country">City</label>
          </div>
          <Select
            className="text-black"
            // TODO: Use `cityOptions` function later!
            options={City.getCitiesOfCountry(
              selectedCountry.value.isoCode
            )?.map((state) => ({
              value: {
                latitude: state.latitude!,
                longitude: state.longitude!,
                countryCode: state.countryCode,
                name: state.name,
                stateCode: state.stateCode,
              },
              label: state.name,
            }))}
            onChange={handleSelectedCity}
            value={selectedCity}
          />
        </div>
      )}
    </div>
  );
}
