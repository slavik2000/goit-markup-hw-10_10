'use strict';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Loading } from 'notiflix';
import { Notify } from 'notiflix';
import './sass/index.scss';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  textError: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

refs.loader.style.display = 'none';
refs.textError.style.display = 'none';
refs.select.style.display = 'none';
refs.catInfo.style.display = 'none';

Loading.dots({
  svgColor: '#5897fb',
  svgSize: '130px',
  messageFontSize: '30px',
});

// Коллекция пород

fetchBreeds()
  .then(data => {
    refs.select.style.display = 'flex';
    refs.loader.style.display = 'none';

    if (Object.keys(data).length === 0) {
      Notify.failure(refs.textError.textContent);
      return;
    }
    createOptions(data)
  })
  .catch(err => {
    Notify.failure(refs.textError.textContent);
  })
  .finally(result => Loading.remove());

function createOptions(arr) {
  const markup = arr.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

  refs.select.innerHTML = markup;

  new SlimSelect({
    select: '#selectElement',
  })
};

refs.select.addEventListener('change', onSearch);

// Информация о коте

function onSearch(evt) {
  // evt.preventDefault();
  const breedId = evt.currentTarget.value.trim();
  // console.log(breedId);

  Loading.dots({
    svgColor: '#5897fb',
    svgSize: '130px',
    messageFontSize: '30px',
  });

  if (!breedId) {
    Notify.failure('Empty field');
    return;
  } else if (breedId === '') {
    Notify.failure(refs.textError.textContent)
    return;
  }
  fetchCatByBreed(breedId)
    .then(data => {
      // console.log(data);      //object
      refs.catInfo.style.display = 'block';
      createMarkup(data);
    }).catch(err => {
      Notify.failure(refs.textError.textContent);
    })
    .finally(result => Loading.remove());

};


function createMarkup(arr) {
  console.log(arr);        //object

  const markup = arr.map(({ breeds, id, url, width }) =>
    `<p>Breed: ${breeds[0].name}</p>
    <img src="${url}" width="400" height="200" alt="${breeds[0].name}">
    <p>Temperament: ${breeds[0].temperament}</p>
    <p>Description: ${breeds[0].description}</p>`
  )
    .join('');

//   refs.catInfo.insertAdjacentHTML('beforeend', markup)
refs.catInfo.innerHTML = markup
};



// const select = document.querySelector('.breed-select');
// const loader = document.querySelector('.loader');
// const textError = document.querySelector('.error');
// const catInfo = document.querySelector('.cat-info');

// textError.setAttribute('hidden', true);
// catInfo.style.display = 'none';

// // Коллекция пород

// fetchBreeds().then(data => {
//     // console.log(typeof data);   // object
//     if (Object.keys(data).length === 0) {
//         textError.setAttribute('hidden', false);      // видно
//         Notify.failure('Oops! Something went wrong! Try reloading the page!');
//         return;
//     } else{
//     // console.log(Object.keys(data).length);

//     createOptions(data)}
// });

// function createOptions(arr) {
//     loader.setAttribute('hidden', true);

//     const markup = arr.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

//     select.innerHTML = markup;

//     new SlimSelect({
//         select: '#selectElement',
//         })
// };

// // Информация о коте

// loader.setAttribute('hidden', false);

// select.addEventListener('change', onSearch);

// function onSearch(evt) {
//     evt.preventDefault();
//     loader.setAttribute('hidden', false);
//     catInfo.innerHTML = '';
//     // console.dir(evt.currentTarget);
//     // console.dir(evt.currentTarget.value);
//     const breedId = evt.currentTarget.value.trim();
//     // console.log(breedId);          // идентификатор породы
//     // console.log(breedId.trim());    // содержимое строки

//     if(!breedId){
//         alert('Empty field');
//         return;
//     } else if (breedId === '') {
//         textError.setAttribute('hidden', false);
//         Notify.failure('Oops! Something went wrong! Try reloading the page!')
//         return;
//     } else {
//         fetchCatByBreed(breedId)
//         .then(data => {
//         console.log(data);      //object
//         createMarkup(data);
//         })
//         .finally(()=>{
//             loader.setAttribute('hidden', true);
//         });
//     };

// };

// function createMarkup(arr) {
//     catInfo.style.display = 'block';
//     console.log(arr);        //object

//     const markup = arr.map(({ breeds, id, url, width} ) =>
//     `<p>Breed: ${breeds[0].name}</p>
//     <img src="${url}" width="400" height="200" alt="${breeds[0].name}">
//     <p>Temperament: ${breeds[0].temperament}</p>
//     <p>Description: ${breeds[0].description}</p>`
//     )
//     .join('');

//     catInfo.insertAdjacentHTML('beforeend', markup)
// };