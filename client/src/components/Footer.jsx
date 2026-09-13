const Footer = () => (
  <footer className="mt-16 border-t border-edge py-8">
    <div className="container-page flex flex-col items-center gap-2 text-center text-sm text-muted">
      <p>CineScope — a MERN movie discovery project.</p>
      <p>
        Movie data provided by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:underline"
        >
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  </footer>
);

export default Footer;
