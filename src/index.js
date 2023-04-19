import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const showInfoNotification = message => Notiflix.Notify.info(message);

const showFailureNotification = message => Notiflix.Notify.failure(message);

const cleanCountryList = () => {
  countryList.innerHTML = '';
};

const cleanCountryInfo = () => {
  countryInfo.innerHTML = '';
};

const cleanMarkup = () => {
  cleanCountryList();
  cleanCountryInfo();
};

const fillCountryList = countries => {
  countryList.innerHTML = countries
    .map(
      e =>
        `<li><img src="${e.flags.svg}" alt="flag" width="20"> <span>${e.name.official}</span></li>`
    )
    .join('');
};

const fillCountryInfo = country => {
  countryInfo.innerHTML = `<p><img src="${country.flags.svg}"
       alt="flag" height="25">
       <span class="title"> ${country.name.official}</span></p>
       <p><strong>Capital:</strong> ${country.capital.join(', ')}</p>
       <p><strong>Population:</strong> ${country.population}</p>
       <p><strong>Languages:</strong> ${Object.values(country.languages).join(
         ', '
       )}</p>`;
};

const handleCountries = countries => {
  const countriesLength = countries.length;

  if (countriesLength > 10) {
    showInfoNotification(
      'Too many matches found. Please enter a more specific name.'
    );

    return;
  }

  if (countriesLength > 1) {
    fillCountryList(countries);

    return;
  }

  cleanCountryList();
  fillCountryInfo(countries[0]);
};

const handleError = error => {
  cleanMarkup();

  showFailureNotification(
    error.message === '404'
      ? 'Oops, there is no country with that name'
      : 'Oops, something went wrong!'
  );

  console.error(error);
};

const searchInput = e => {
  const value = e.target.value.trim();

  if (value === '') {
    cleanMarkup();

    return;
  }

  cleanCountryInfo();

  fetchCountries(value).then(handleCountries).catch(handleError);
};

searchBox.addEventListener('input', debounce(searchInput, DEBOUNCE_DELAY));
