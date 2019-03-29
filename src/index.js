// VARIABLES:
const gifsUrl = "http://localhost:3000/api/v1/gifs";
const commentsUrl = "http://localhost:3000/api/v1/comments";
const ulIcons = document.querySelector('.list-gifs');
const dancingDiv = document.querySelector('.gif-dancing-panda');
const likesCommentsDiv = document.querySelector('.btns-like-comment');
const commentsDiv = document.querySelector('.comments');
const commentForm = document.querySelector('.comment-form')
const commentList = document.querySelector('.comments-list')
//---

// FUNCTIONS:
function gifsList (gif) {
  return `
  <li id="gif" data-id=${gif.id}>
    <br>
    <img src="${gif.img_url}" width="20" height="20">
  </li>
  `
};

function displayDancingPanda(panda) {
  return `
    <img src="${panda.img_url}" data-id="${panda.id}" class="dancing-panda">
    <audio loop id="song" src="sounds/${panda.music}"></audio>
  `
};

function displayLikesAndAddComments(panda) {
  return `
    <button class='btn-like' data-gif-id=${panda.id}>${panda.likes} Likes</button>
    <button class='btn-comment' data-gif-id=${panda.id}>Add Comment</button>
  `
};

function displayCommentForm(id) {
  return `
    <hr>
    <form class="comment-form" data-gif-id="${id}">
      <input type="text" name="name" placeholder="name">
      <textarea type="text" name="comment" placeholder="comment"></textarea>
      <input type="submit" value="SUBMIT">
    </form>
    <hr>
  `
};

function displayPandaComments(panda){
  const commentsArr = panda.comments.map(comment => {
    return commentCard(comment)
  })
  return commentsArr.join(" ")
};

function commentCard(comment){
  return `
    <li class='comment-card' data-comment-id=${comment.id}>
      <p class="comment">${comment.comment}</p>
      <footer class="comment-footer">– ${comment.name}</footer><br>
      <button class='btn-delete-comment' data-comment-id=${comment.id}>Delete Comment</button>
      <hr>
    </li>
  `
}

function playSound() {
  const audio = document.querySelector('#song')
  if(!audio) return;
  // audio.currentTime = 30
  audio.play();
};

function getPanda(id) {
  // debugger
  return fetch(gifsUrl + '/' + id)
  .then(resp => resp.json())
};

function updateLikes(id, currentLikes) {
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
  .then(resp => resp.json())
};

function createComment(gif_id, name, comment) {
  const fetchObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      gif_id: gif_id,
      name: name,
      comment: comment
    })
  };
  return fetch(commentsUrl, fetchObj)
  .then(resp => resp.json())
};

function deleteComment(id) {
  return fetch(commentsUrl + '/' + id, {method: "DELETE"})
};
//-----

// EVENT LISTENERS:
ulIcons.addEventListener('click', e => {
  let image = e.target
  let pandaLi = e.target.parentElement
  if (pandaLi.id === "gif") {
    getPanda(pandaLi.dataset.id)
    .then(panda => {
      if (!!panda) {
        if (panda.name === "Random"){
          console.log(panda.name)
          randomGif()
          .then(gif => {
            panda.img_url = gif.data.image_url
            // debugger
            dancingDiv.innerHTML = displayDancingPanda(panda)
            likesCommentsDiv.innerHTML = displayLikesAndAddComments(panda)
            const ulPanda = commentList.querySelector('ul')
            ulPanda.innerHTML = displayPandaComments(panda)
            playSound()

          })
        } else {
          console.log(panda.name)
          dancingDiv.innerHTML = displayDancingPanda(panda)
          likesCommentsDiv.innerHTML = displayLikesAndAddComments(panda)
          const ulPanda = commentList.querySelector('ul')
          ulPanda.innerHTML = displayPandaComments(panda)
          playSound()
        }
      }
    })
  }
}); // Displays dancing panda-gif with its likes and comments after clicking on its small icon

likesCommentsDiv.addEventListener('click', e => {
  const button = e.target
  if (button.className === "btn-like") {
    let likesOnTheDom = button
    let currentLikes = parseInt(likesOnTheDom.innerText) + 1
    updateLikes(button.dataset.gifId, currentLikes)
    .then(updatedLikes => {
      if (!!updateLikes) {
        likesOnTheDom.innerHTML = `${currentLikes} Likes`
      }
    })
  } else if (button.className === "btn-comment") {
    commentsDiv.innerHTML += displayCommentForm(button.dataset.gifId)
  }
}); // Updates a panda-gif's likes or brings up form to input comments

commentsDiv.addEventListener('submit', e => {
  e.preventDefault()
  let form = e.target
  let name = form.name.value
  let comment = form.querySelector('textarea').value
  let ulCommentTag = commentList.firstElementChild
  let gif_id = form.dataset.gifId
  createComment(gif_id, name, comment)
  .then(newComment => {
    ulCommentTag.innerHTML += commentCard(newComment)
    let pandaId = commentsDiv.querySelector('form').dataset.gifId
    commentsDiv.innerHTML = displayCommentForm(pandaId)
  })
}); // Creates comments and adds to comment divs

commentList.addEventListener('click', e => {
  const deleteButton = e.target
  deleteButton.parentElement.remove()
  if (deleteButton.className === "btn-delete-comment") {
    deleteComment(deleteButton.dataset.commentId)
    // .then(resp => {
    //   if (resp.ok) {
    //     debugger
    //   }
    // })
  }
}); // Deletes a comment
//-----

// GETs panda gifs
fetch(gifsUrl)
.then(resp => resp.json())
.then(gifs => {
  gifs.forEach(gif => {
    ulIcons.innerHTML += gifsList(gif)
  });
});
//-----


// GETs random panda gifs
const randomPandaGif = "http://api.giphy.com/v1/gifs/random?&api_key=ALxfIZtyKtnS3FYBjJQZ7swvsLGDq6Di&tag=panda"
const pandaSearch = "http://api.giphy.com/v1/gifs/search?&api_key=ALxfIZtyKtnS3FYBjJQZ7swvsLGDq6Di&q=panda&limit=3"

function randomGif() {
  return fetch(randomPandaGif)
  .then(resp => resp.json())
}
//-----
