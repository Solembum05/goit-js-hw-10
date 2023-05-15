import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;
import { fetchCountries } from './fetchCountries';

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch() {
  const countryName = refs.input.value.trim();
  if (countryName === '') {
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(result => {
      if (result.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (result.length === 1) {
        return result.reduce(
          (markup, el) => markup + makeOneCountryMarkup(el),
          ''
        );
      } else {
        return result.reduce(
          (markup, el) => markup + makeManyCountryMarkup(el),
          ''
        );
      }
    })
    .then(updateCountryList)
    .catch(onError);
}

function makeOneCountryMarkup(el) {
  const languages = Object.values(el.languages).join(', ');
  return `
  <div>
  <h2>
  <img 
        src=${el.flags.svg} 
        alt="${el.flags.alt}"
        width=50px 
        height=25px
        version="1.1"
        viewBox="0 0 25 25"/>
        ${el.name.common}
  </h2>
      <h3>Capital: ${el.capital}</h3>
      <h3>Population: ${el.population}</h3>
      <h3>Languages: ${languages}</h3>
  </div>`;
}

function makeManyCountryMarkup(el) {
  return `
    <li name="${el.name.common}" class="list">
        <img 
        src=${el.flags.svg} 
        alt="${el.flags.alt}"
        width=50px 
        height=25px
        version="1.1"
        viewBox="0 0 25 25"/> 
        <p>${el.name.common}</p>
    </li>`;
}

function updateCountryList(markup) {
  if (markup) refs.countryList.innerHTML = markup;
  return;
}

function onError(err) {
  Notify.failure(`Oops, there is no country with name`);
}
