function togglesearch() {
  if (document.getElementById('sitesearch').classList.contains('is-hidden')) {
    document.getElementById('sitesearch').classList.remove('is-hidden')
  } else {
    document.getElementById('sitesearch').classList.add('is-hidden')
  }
}

function dosearch() {
  const url = "https://github.com/search?type=code&q=repo%3Anicolasbrailo%2Fnicolasbrailo.github.io%20";
  const q = document.getElementById('sitesearch_q').value;
  document.location = url + encodeURI(q);
}
