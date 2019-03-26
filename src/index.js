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
    <img src="${gif.img_url}" width="75" height="75">
    </li>
  `
};

function displayDancingPanda(gifObj) {
  pandaDiv.dataset.id = gifObj.data.id
  return `
  <h2 data-id="${gifObj.data.id}">${gifObj.data.name}</h2>
  <img class="featured-gif" src="${gifObj.data.img_url}">
  <audio id="song" src="sounds/${gifObj.data.music}"></audio>
  <button type="button">Rate my moves!</button>
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
// adding comment form to button and fetching from comments
const creatingGifCommentHTML = (gif_id) => {
    return `<form data-id='${gif_id}'>
                First Name:<br>
                <input type="text" name="firstname" value=""><br>
                Comment:<br>
                <input type="text" name="comment" value=""><br><br>
                <input type="submit" value="Submit">
              </form>`
}

pandaDiv.addEventListener('click', event => {
  // debugger
  if(event.target.tagName === 'BUTTON') {
    let gif_id = pandaDiv.dataset.id
    pandaDiv.innerHTML += creatingGifCommentHTML(gif_id)
    // stops playing sound so added this in the bottom need to fix
    // also makes multiple forms
    const gifCommentFormTag = document.querySelector('form')
    gifCommentFormTag.addEventListener('submit', event => {
      event.preventDefault()
      let name = event.target.firstname.value
      let comment = event.target.comment.value
      addingCommentsToBackEnd(name, comment, gif_id).then(console.log)
       pandaDiv.innerHTML += `<h3>${comment} said ${name}</h3>`
       // Creatig an object with a null ID and and null gif_ID need to fix.
       // also when adding another comment the submit button refreshed the page.
       playSound()
    })
    playSound()

  }
})

const addingCommentsToBackEnd = (name, comment, gif_id) => {
  return fetch(`http://localhost:3000/api/v1/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      comment: comment,
      gif_id: gif_id
    })
  })
  .then(res => res.json())
}


//-----
