const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const historyList = document.querySelector('#history-list');
const clearHistoryButton = document.querySelector('#clear-history');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value;
  searchBooks(query);
  addToHistory(query);
});

function searchBooks(query) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayResults(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayResults(data) {
  searchResults.innerHTML = '';
  data.items.forEach((book) => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const titleElement = document.createElement('h2');
    titleElement.textContent = book.volumeInfo.title;
    bookElement.appendChild(titleElement);

    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${book.volumeInfo.authors}`;
    bookElement.appendChild(authorElement);

    const imageElement = document.createElement('img');
    imageElement.src = book.volumeInfo.imageLinks.thumbnail;
    bookElement.appendChild(imageElement);

    searchResults.appendChild(bookElement);
  });
}

function addToHistory(query) {
  let history = localStorage.getItem('history') || [];
  if (typeof history === 'string') {
    history = JSON.parse(history);
  }
  history.unshift(query);
  history = history.slice(0, 5);
  localStorage.setItem('history', JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  historyList.innerHTML = '';
  let history = localStorage.getItem('history') || [];
  if (typeof history === 'string') {
    history = JSON.parse(history);
  }
  history.forEach((query) => {
    const itemElement = document.createElement('li');
    itemElement.textContent = query;
    itemElement.addEventListener('click', () => {
      searchBooks(query);
      searchInput.value = query;
    });
    historyList.appendChild(itemElement);
  });
}

function clearHistory() {
  localStorage.removeItem('history');
  displayHistory();
}

clearHistoryButton.addEventListener('click', clearHistory);

displayHistory();