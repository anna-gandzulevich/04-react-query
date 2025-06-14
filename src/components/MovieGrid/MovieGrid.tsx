import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';
interface MovieGridProps {
  onSelect: (film: Movie) => void;
  movies: Movie[];
}
export default function MovieGrid({ onSelect, movies }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map(elem => (
        <li
          key={elem.id}
          onClick={() => {
            onSelect(elem);
          }}
        >
          <div className={css.card}>
            <img
              className={css.image}
              src={`https://image.tmdb.org/t/p/w500/${elem.poster_path}`}
              alt={elem.title}
              loading="lazy"
            />
            <h2 className={css.title}>{elem.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
