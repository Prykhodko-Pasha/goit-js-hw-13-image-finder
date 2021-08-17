import countryTpl from '../templates/country.hbs';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const refs = {
  input: document.querySelector('#input'),
  output: document.querySelector('.country'),
};

// pnotify
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.maxTextHeight = null; //Deleting Maximum height of the text container
//===========

refs.input.addEventListener('input', debounce(searchCountry, 500));

function searchCountry(e) {
  const searchQuery = e.target.value.trim();
  // console.log(searchQuery);
  if (searchQuery) {
    generateSearchQueryResult(searchQuery);
  }
  resetOutput();
}

function generateSearchQueryResult(searchQuery) {
  fetchCountries(searchQuery)
    .then(data => {
      // console.log(data);
      if (data.length > 10) {
        resetOutput();
        error({
          title: 'Sorry!',
          text: 'Too many matches found. Please enter a more specific query!',
          delay: 3000,
        });
      } else if (data.length === 1) {
        const countryMarkup = countryTpl(data[0]);
        refs.output.innerHTML = countryMarkup;
      } else if (data.length <= 10) {
        const countryMarkup = data
          .map(country => `<li><a href=# class="country__item">${country.name}</a></li>`)
          .join('');
        refs.output.innerHTML = `<ul class="country__list">${countryMarkup}</ul>`;
        const countryListEl = document.querySelector('.country__list');
        countryListEl.addEventListener('click', onCountryClick);
      } else {
        resetOutput();
        error({
          title: 'Sorry!',
          text: 'No matches found. Please enter a correct query!',
          delay: 3000,
        });
      }
    })
    .catch(err => {
      console.log("I've cathed error: ", err);
      error({
        title: 'Oops!',
        text: 'Something went wrong on your side...',
        delay: 3000,
      });
    });
}

function resetOutput() {
  refs.output.innerHTML = '';
}

function onCountryClick(e) {
  if (e.target.className === 'country__item') {
    const searchQuery = e.target.textContent;
    // console.log(searchQuery);
    generateSearchQueryResult(searchQuery);
  }
}
