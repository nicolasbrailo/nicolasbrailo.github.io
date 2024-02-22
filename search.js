function togglesearch() {
  if (document.getElementById('sitesearch').classList.contains('is-hidden')) {
    document.getElementById('sitesearch').classList.remove('is-hidden')
  } else {
    document.getElementById('sitesearch').classList.add('is-hidden')
  }
}

function triggerSearch(e) {
  console.log("SRC")
  if (e.preventDefault) e.preventDefault();
  const url = "https://github.com/search?type=code&q=repo%3Anicolasbrailo%2Fnicolasbrailo.github.io%20";
  const q = document.getElementById('sitesearch_q').value;
  console.log("q")
  document.location = url + encodeURI(q);
  return false;
}

if (document.getElementById('sitesearch').attachEvent) {
  document.getElementById('sitesearch').attachEvent("submit", triggerSearch);
  console.log("w")
} else {
  document.getElementById('sitesearch').addEventListener("submit", triggerSearch);
  console.log("X")
}
