const countryList = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?${countryList}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
