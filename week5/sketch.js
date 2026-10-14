const button = document.getElementById("generate-button");
const saveButton = document.getElementById("save-button");

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

const supabaseClient = supabase.createClient(
  "https://uspxokoxzbajirtyhtjv.supabase.co",
  "sb_publishable_QfPcMD4M9fWHFAL5oHRznA_7g7g-v5Y"
);


button.addEventListener("click", generateMeme);
saveButton.addEventListener("click", saveMeme);

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

fetch("https://api.adviceslip.com/advice?" + Date.now())
  .then(response => response.json())
  .then(data => {
    memeText.textContent = data.slip.advice;
  });

  fetch("https://yesno.wtf/api?" + Date.now())
    .then(response => response.json())
    .then(data => {
      memeImage.src = data.image;
    });

}


// SAVE MEME FUNCTION
async function saveMeme() {

  const { error } = await supabaseClient
    .from("memes")
    .insert({
      image_url: memeImage.src,
      meme_text: memeText.textContent
    });

  if (error) {
    console.error("Could not save meme:", error);
  } else {
    console.log("Meme saved!");
  }
}