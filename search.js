function togglesearch() {
  if (document.getElementById('sitesearch').classList.contains('is-hidden')) {
    document.getElementById('sitesearch').classList.remove('is-hidden')
  } else {
    document.getElementById('sitesearch').classList.add('is-hidden')
  }
}

function triggerSearch(e) {
  if (e.preventDefault) e.preventDefault();
  const url = "https://github.com/search?type=code&q=repo%3Anicolasbrailo%2Fnicolasbrailo.github.io%20";
  const q = document.getElementById('sitesearch_q').value;
  document.location = url + encodeURI(q);
  return false;
}

if (document.getElementById('sitesearch').attachEvent) {
  document.getElementById('sitesearch').attachEvent("submit", triggerSearch);
} else {
  document.getElementById('sitesearch').addEventListener("submit", triggerSearch);
}
