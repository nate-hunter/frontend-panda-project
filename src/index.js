// VARIABLES:
const gifsUrl = "http://localhost:3000/api/v1/gifs"
const ulTag = document.querySelector('#pandas')
const pandaDiv = document.querySelector('#gif-detail')
//-----

// FUNCTIONS:
function gifsList(gif) {
  return `
  <li id="gif" data-id=${gif.id}>
    <br>
    <img src="${gif.img_url}" width="100" height="100">
    </li>
  `
};

function displayDancingPanda(gifObj) {
  pandaDiv.dataset.id = gifObj.data.id
  return `
  <h1 data-id="${gifObj.data.id}">${gifObj.data.name}</h1>
  <img src="${gifObj.data.img_url}">
  <audio loop id="song" src="sounds/${gifObj.data.music}"></audio>
  `
};

function getPanda(id) {
  return fetch(gifsUrl + '/' + id)
  .then(resp => resp.json())
};

function playSound(e) {
  const audio = document.querySelector('#song')
  if(!audio) return;
  audio.currentTime = 0
  audio.play();
  // key.classList.add('playing');
};
//-----

// EVENT LISTENERS:
ulTag.addEventListener('click', e => {
  const pandaGIF = e.target
  const liTag = pandaGIF.parentElement
  if (pandaGIF.parentElement.id === "gif") {
    getPanda(liTag.dataset.id)
    .then(gifObj => {
      if (!!gifObj) {
        pandaDiv.dataset.id = liTag.dataset.id
        pandaDiv.innerHTML = displayDancingPanda(gifObj)
        playSound()
      }
    })
  }
});
//-----

// GETs gifs:
fetch(gifsUrl)
.then(resp => resp.json())
.then(gifs => {
  // console.log(gifs)
  gifs.data.forEach(gif => {
    ulTag.innerHTML += gifsList(gif)
  })
})
//-----
