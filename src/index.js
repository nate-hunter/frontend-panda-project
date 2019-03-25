// VARIABLES:
const gifsUrl = "http://localhost:3000/api/v1/gifs"
const ulTag = document.querySelector('#pandas')
//-----

// FUNCTIONS:
function gifsList(gif) {
  return `
    <li id="gif" data-id=${gif.id}>${gif.name}</li>
    <img src="${gif.img_url}">
  `
};
//-----

// GETs gifs:
fetch(gifsUrl)
.then(resp => resp.json())
.then(gifs => {
  console.log(gifs)
  gifs.data.forEach(gif => {
    ulTag.innerHTML += gifsList(gif)
  })
})
//-----
