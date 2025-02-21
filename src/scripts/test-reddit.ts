import { fetchOllamaPosts } from "../lib/reddit.js";

console.log("Starting fetch...");
fetchOllamaPosts()
  .then((posts) => {
    console.log("Success! Posts:", posts);
  })
  .catch((err) => {
    console.error("Failed:", err);
  });
