import imageTpl from '../templates/image.hbs';
import fetchImages from './apiService';
import debounce from 'lodash.debounce';

const refs = {
  input: document.querySelector('#search-form'),
  output: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('#loadMore'),
};

let pageNumber = 1;
let searchQuery = '';

// noty
import Noty from 'noty';
import 'noty/src/noty.scss';
import 'noty/src/themes/nest.scss';

// basicLightbox
import * as basicLightbox from 'basiclightbox';

// pnotify
// import '@pnotify/core/dist/PNotify.css';
// import '@pnotify/core/dist/BrightTheme.css';
// import { error } from '@pnotify/core';
// import { defaults } from '@pnotify/core';
// defaults.maxTextHeight = null; //Deleting Maximum height of the text container
//===========

refs.input.addEventListener('input', debounce(searchImages, 500));
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.output.addEventListener('click', e => {
  if (e.target.className === 'card-img') {
    onOpenLightbox(e.target.dataset.source);
  }
});

function searchImages(e) {
  refs.loadMoreBtn.classList.add('is-hidden');
  searchQuery = e.target.value.trim();
  // console.log(searchQuery);
  if (searchQuery) {
    pageNumber = 1;
    generateSearchQueryResult(searchQuery, pageNumber);
  }
  resetOutput();
}

function onLoadMoreBtn() {
  pageNumber += 1;
  console.log(pageNumber);
  console.log(searchQuery);
  generateSearchQueryResult(searchQuery, pageNumber);
}

function generateSearchQueryResult(searchQuery, pageNumber) {
  fetchImages(searchQuery, pageNumber)
    .then(data => {
      // console.log(data);
      if (data.hits.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');

        new Noty({
          theme: 'nest',
          type: 'error',
          text: 'Sorry!<br>No matches found...',
          timeout: 3000,
        }).show();
      } else {
        const galleryMarkup = data.hits.map(image => imageTpl(image)).join('');
        refs.output.insertAdjacentHTML('beforeend', galleryMarkup);

        refs.loadMoreBtn.classList.remove('is-hidden');

        refs.loadMoreBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });

        const totalPages = Math.ceil(data.total / 12);
        if (totalPages === pageNumber) {
          refs.loadMoreBtn.classList.add('is-hidden');
        }
      }
    })
    .catch(err => {
      console.log("I've cathed error: ", err);
      new Noty({
        theme: 'nest',
        type: 'error',
        text: "Sorry!<br>Something went wrong...<br>Can't load more images<br>:(",
        timeout: 5000,
      }).show();
    });
}

function onOpenLightbox(src) {
  basicLightbox.create(`<img src=${src}>`).show();
}

function resetOutput() {
  refs.output.innerHTML = '';
}
