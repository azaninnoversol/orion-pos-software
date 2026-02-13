// firebase
import { BASE_URL, BASE_URL_CITIES } from "@/utils/config";

// redux
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Country {
  name: { common: string };
  cca2: string;
}

interface CityRequest {
  country: string;
}

interface CityResponse {
  data: string[];
  error?: boolean;
  msg?: string;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], string>({
      query: (searchTerm) => {
        return searchTerm ? `/name/${searchTerm}` : "/all";
      },
    }),

    getCities: builder.mutation<CityResponse, CityRequest>({
      query: (body) => ({
        url: `${BASE_URL_CITIES}/countries/cities`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetCountriesQuery, useGetCitiesMutation } = locationApi;
