import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const cleanMarkup = () => {
  countryInfo.innerHTML = '';
};

const searchInput = e => {
  const searchCountry = e.target.value.trim();
  if (searchCountry === '') {
    cleanMarkup();
    countryList.innerHTML = '';
    return;
  }

  cleanMarkup();

  fetchCountries(searchCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      let result = countries.filter(
        el => el.name.official.toUpperCase() === searchCountry.toUpperCase()
      );
      if (countries.length > 1 && countries.length <= 10 && result) {
        countryList.innerHTML = countries
          .map(
            e =>
              `<li><img src="${e.flags.svg}" alt="flag" width="20"> <span>${e.name.official}</span></li>`
          )
          .join('');
        return;
      }
      if (result) {
        result = 0;
      }

      const country = countries[result];

      countryList.innerHTML = '';
      countryInfo.innerHTML = `<p><img src="${country.flags.svg}"
       alt="flag" height="25">
       <span class="title"> ${country.name.official}</span></p>
       <p><strong>Capital:</strong> ${country.capital.join(', ')}</p>
       <p><strong>Population:</strong> ${country.population}</p>
       <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>`;
    })
    .catch(error => {
      if (error.status && error.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure('Oops, something went wrong!');
      }
      console.error(error);
    });
};

searchBox.addEventListener('input', debounce(searchInput, DEBOUNCE_DELAY));

