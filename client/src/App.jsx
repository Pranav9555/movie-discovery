// Routing and page layout.
// The wishlist provider wraps everything so the navbar badge and every
// movie card can read the same saved-movie list.

import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import { WishlistProvider } from "./context/WishlistContext";

// Scroll to the top whenever the path changes (not on query changes,
// so paging through search results is handled by the pagination itself).
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <WishlistProvider>
    <ScrollToTop />
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </WishlistProvider>
);

export default App;
