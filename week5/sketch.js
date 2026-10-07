const button = document.getElementById("generate-button");
const memeText = document.getElementById("meme-text");
const memeImage = document.getElementById("meme-image");

// const words = [
//   "food",
//   "funny",
//   "fire",
//   "love",
//   "home",
//   "skeleton",
//   "computer",
//   "angel",
//   "spiderman",
//   "skull",
//   "rainbow",
//   "tv"
  
// ];



button.addEventListener("click", generateMeme);

function generateMeme() {

  // Get text
  fetch("https://corporatebs-generator.sameerkumar.website/?" + Date.now())
    .then(response => response.json())
    .then(data => {
      memeText.textContent = data.phrase;
    });

// const word = words[Math.floor(Math.random() * words.length)];

// fetch("https://gifcities.archive.org/api/v1/gifsearch?q=" + word)
//   .then(response => response.json())
//   .then(data => {
//     const result = data[Math.floor(Math.random() * data.length)];

// //     const gifURL =
// //       "https://web.archive.org/web/" +
// //       result.gif.replace("/", "im_/");

// //     memeImage.src = gifURL;
//   });

  // Get image

  fetch("https://yesno.wtf/api?" + Date.now())
    .then(response => response.json())
    .then(data => {
      memeImage.src = data.image;
    });

}