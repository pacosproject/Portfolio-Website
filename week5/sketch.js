const button = document.getElementById("generate-button");
const saveButton = document.getElementById("save-button");

const memeText = document.getElementById("meme-text");
const memeImage = document.getElementById("meme-image");


const supabaseClient = supabase.createClient(
  "https://jjtifytgcdzdreyywkrk.supabase.co",
  "sb_publishable_TRydIVq4-JT_JaIx_lQgNw_ZuvymT-F"
);



button.addEventListener("click", generateMeme);
saveButton.addEventListener("click", saveMeme);

function generateMeme() {

  // Get text
fetch("https://api.adviceslip.com/advice?" + Date.now())
  .then(response => response.json())
  .then(data => {
    memeText.textContent = data.slip.advice;
  });


//   });


    // Get image

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