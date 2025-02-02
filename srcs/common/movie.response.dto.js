export const movieResponseDTO = (movie) => ({
    movieId: movie.movie_id,
    title: movie.movie_name,
    posterUrl: movie.production_image,
  });
  