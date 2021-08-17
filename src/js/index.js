import imageTpl from '../templates/image.hbs';
import fetchImages from './apiService';
import debounce from 'lodash.debounce';

const refs = {
  input: document.querySelector('#search-form'),
  output: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('#loadMore'),
};

// noty
import Noty from 'noty';
import 'noty/src/noty.scss';
import 'noty/src/themes/nest.scss';

// basicLightbox
import * as basicLightbox from 'basiclightbox';
//===========

let pageNumber = 1;
let searchQuery = '';

refs.input.addEventListener('input', debounce(searchImages, 500));

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

refs.output.addEventListener('click', e => {
  console.log(e.target.className);
  if (e.target.className === 'card-img') {
    onOpenLightbox(e.target.dataset.source);
  }
});

function searchImages(e) {
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.output.innerHTML = '';
  searchQuery = e.target.value.trim();
  // console.log(searchQuery);
  if (searchQuery) {
    pageNumber = 1;
    generateSearchQueryResult(searchQuery, pageNumber);
  }
}

function onLoadMoreBtn() {
  pageNumber += 1;
  // console.log(pageNumber);
  // console.log(searchQuery);
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
