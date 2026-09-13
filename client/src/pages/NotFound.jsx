import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="text-6xl font-bold text-gold">404</p>
    <h1 className="mt-3 text-xl font-semibold">Page not found</h1>
    <p className="mt-2 text-sm text-muted">That page does not exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">
      Go home
    </Link>
  </div>
);

export default NotFound;
