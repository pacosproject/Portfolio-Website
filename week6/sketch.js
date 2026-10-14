const supabaseClient = supabase.createClient(
  "https://jjtifytgcdzdreyywkrk.supabase.co",
  "sb_publishable_TRydIVq4-JT_JaIx_lQgNw_ZuvymT-F"
);

const memeDatabase = document.getElementById("meme-database");


async function getMemes() {

  const { data, error } = await supabaseClient
    .from("memes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not retrieve memes:", error);
    return;
  }


    data.forEach(meme => {
    const memeDiv = document.createElement("div");
    memeDiv.className = "meme";

    const image = document.createElement("img");
    image.src = meme.image_url;
    image.className = "meme-image";

    const text = document.createElement("p");
    text.textContent = meme.meme_text;
    text.className = "meme-text";

    memeDiv.appendChild(image);
    memeDiv.appendChild(text);

    memeDatabase.appendChild(memeDiv);
  });
}

getMemes();
