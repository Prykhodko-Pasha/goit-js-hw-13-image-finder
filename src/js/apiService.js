const API_KEY = '22963299-57829f6e237632471c998bdfc';

export default function fetchImages(searchQuery, pageNumber) {
  return (
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNumber}&per_page=12&key=${API_KEY}`,
    )
      .then(response => response.json())
      // .then(data => data.hits)
      .catch(error => Promise.reject(error))
  );
}
