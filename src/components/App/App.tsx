import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie.ts";
import { useEffect, useMemo, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

const notify = () => toast.error("No movies found for your request.");

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedFilm, setSelectedFilm] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["film", searchTerm, page],
    queryFn: () => fetchMovies(searchTerm, page),
    enabled: searchTerm.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  const films = useMemo<Movie[]>(() => {
    return data?.results ?? [];
  }, [data]);

  useEffect(() => {
    if (isSuccess && films.length === 0) {
      notify();
    }
  }, [isSuccess, films]);

  const handleSearch = async (film: string): Promise<void> => {
    setSearchTerm(film);
    setPage(1);
  };

  const handleChoice = (film: Movie): void => {
    setSelectedFilm(film);
  };

  const handleClosing = (): void => {
    setSelectedFilm(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && films.length > 0 && (
        <MovieGrid onSelect={handleChoice} movies={films} />
      )}
      {selectedFilm && (
        <MovieModal movie={selectedFilm} onClose={handleClosing} />
      )}
      <Toaster />
    </div>
  );
}
