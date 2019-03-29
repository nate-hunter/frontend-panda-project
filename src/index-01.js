// VARIABLES:
const gifsUrl = "http://localhost:3000/api/v1/gifs"
const ulTag = document.querySelector('#pandas')
const pandaDiv = document.querySelector('#gif-detail')
const likeComment = document.querySelector('#like-comment')
const commentList = document.querySelector('#comments-list')
//-----

// FUNCTIONS:
function gifsList(gif) {
  return `
    <li id="gif" data-id=${gif.id}>
      <br>
      <img src="${gif.img_url}" width="30" height="30">
    </li>
  `
};

function displayDancingPanda(gifObj) {
  pandaDiv.dataset.id = gifObj.data.id
  return `
  <h2 data-id="${gifObj.data.id}">${gifObj.data.name}</h2>
  <img class="featured-gif" src="${gifObj.data.img_url}">
  <audio controls loop id="song" src="sounds/${gifObj.data.music}"></audio>
  <button type="button">Rate my moves!</button>
  `
};

function displayLikesAndComments(gifObj) {
  return `
    <button class='btn-like' data-id=${gifObj.data.id}><3 Likes: <span>${gifObj.data.likes}</span></button>
    <button class='btn-comment' data-id=${gifObj.data.id}>Add Comment</button>
  `
};

const creatingGifCommentHTML = (gif_id) => {
    return `
    <form data-id='${gif_id}'>First Name:<br>
      <input type="text" name="firstname" placeholder="name"><br>
      Comment:<br>
      <input type="text" name="comment" placeholder="comment"><br><br>
      <input type="submit" value="Submit">
    </form>`
} // Do you mind if we change from First name to Name so the user can put in any name?

function createCommentListItem(comment) {
  // return `<li ${comment.id}>`
  return `
    <li class='comment-list-item' data-id=${comment.id}>
      <p class="mb-0">${comment.comment}</p>
      <footer class="blockquote-footer">${comment.name}</footer>
    </li>
  `
};

function getPanda(id) {
  return fetch(gifsUrl + '/' + id)
  .then(resp => resp.json())
};

function updateLikes(id, currentLikes) {
  // debugger
  const fetchObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: currentLikes
    })
  };
  return fetch(gifsUrl + '/' + id, fetchObj)
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
  const likeComment = pandaDiv.parentElement.parentElement.querySelector('#like-comment')
  if (pandaGIF.parentElement.id === "gif") {
    getPanda(liTag.dataset.id)
    .then(gifObj => {
      if (!!gifObj) {
        pandaDiv.dataset.id = liTag.dataset.id
        pandaDiv.innerHTML = displayDancingPanda(gifObj)
        playSound()
        likeComment.innerHTML = displayLikesAndComments(gifObj)
      }
    })
  }
});

likeComment.addEventListener('click', e => {
  if (e.target.className === 'btn-like') {
    let likeButton = e.target
    let likesOnTheDom = e.target.querySelector('span');
    let currentLikes = parseInt(e.target.querySelector('span').innerText) + 1
    updateLikes(likeButton.dataset.id, currentLikes)
    .then(resp => {
      if (resp.ok) {
        likesOnTheDom.innerText = currentLikes
      }
    })

  } else if(e.target.className === 'btn-comment') {
    let commentButton = e.target
    let likeCommentDiv = e.target.parentElement
    // let gif_id = pandaDiv.dataset.id
    likeCommentDiv.innerHTML += creatingGifCommentHTML(commentButton.dataset.id)
    // stops playing sound so added this in the bottom need to fix
    // also makes multiple forms
    const gifCommentFormTag = document.querySelector('form')
    gifCommentFormTag.addEventListener('submit', event => {
      event.preventDefault()
      let form = event.target
      let name = event.target.firstname.value
      let comment = event.target.comment.value
      addingCommentsToBackEnd(name, comment, form.dataset.id)
      .then(commentObj => {
        if (!!commentObj) {
          if (commentObj.gif_id) {
            debugger
            commentList.innerHTML += createCommentListItem(commentObj)

          }
        }
      })
      // debugger

       // pandaDiv.innerHTML += `<h3>${comment} said ${name}</h3>`
       // Creatig an object with a null ID and and null gif_ID need to fix.
       // also when adding another comment the submit button refreshed the page.
       // playSound()
    })
    // playSound()
  }
})

// pandaDiv.addEventListener('click', event => {
//   // debugger
//   if(event.target.tagName === 'BUTTON') {
//     let gif_id = pandaDiv.dataset.id
//     pandaDiv.innerHTML += creatingGifCommentHTML(gif_id)
//     // stops playing sound so added this in the bottom need to fix
//     // also makes multiple forms
//     const gifCommentFormTag = document.querySelector('form')
//     gifCommentFormTag.addEventListener('submit', event => {
//       event.preventDefault()
//       let name = event.target.firstname.value
//       let comment = event.target.comment.value
//       addingCommentsToBackEnd(name, comment, gif_id).then(console.log)
//        pandaDiv.innerHTML += `<h3>${comment} said ${name}</h3>`
//        // Creatig an object with a null ID and and null gif_ID need to fix.
//        // also when adding another comment the submit button refreshed the page.
//        playSound()
//     })
//     playSound()
//   }
// })

//-----


// adding comment form to button and fetching from comments
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
};
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
