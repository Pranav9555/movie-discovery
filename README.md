# Movie Discovery App (MERN)

A full-stack movie discovery platform. Browse trending, popular, top-rated and
upcoming movies, search with debouncing, filter by genre/year, sort, paginate,
open a details page, and keep a persistent wishlist stored in MongoDB.

**Stack:** React + Vite + JavaScript + Tailwind CSS + React Router + Axios ·
Node.js + Express + Axios · MongoDB + Mongoose · TMDB API.

---

## 1. Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI
- A free TMDB API key: https://www.themoviedb.org/settings/api

### Backend

```bash
cd server
npm install
cp .env.example .env      # then fill in TMDB_API_KEY and MONGO_URI
npm run dev               # http://localhost:5000
```

### Frontend

```bash
cd client
npm install
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

Open http://localhost:5173.

Health check: http://localhost:5000/api/health

---

## 2. Architecture

```text
React Frontend (Vite)
      |
      |  HTTP / JSON  (axios)
      v
Node.js + Express Backend
      |
      +-- Movie Service ----> TMDB API
      |
      +-- Wishlist Service --> MongoDB (Mongoose)
```

The React app **never** talks to TMDB directly. The TMDB API key lives only in
`server/.env`. Every movie request goes through our own Express API, which
calls TMDB, normalizes the response, and returns a consistent shape.

### Backend layering

```text
route  ->  controller  ->  service  ->  (TMDB | MongoDB)
```

- **routes/** — URL definitions only.
- **controllers/** — read/validate the request, call a service, send a response.
- **services/** — the actual work (HTTP calls to TMDB, Mongoose queries).
- **models/** — Mongoose schemas.
- **middleware/** — validation, rate limiting, 404, central error handler.
- **utils/** — response normalization, tiny in-memory cache, ApiError class.

---

## 3. Data flow

### Browsing the home page

1. `Home` mounts and calls `getTrending()` in `client/src/services/movieApi.js`.
2. Axios sends `GET /api/movies/trending?page=1` to Express.
3. `movieRoutes` -> `movieController.getTrending` -> `tmdbService.fetchTrending`.
4. The service checks the in-memory cache, otherwise calls TMDB.
5. `normalizeMovieList` converts the TMDB payload into our own shape.
6. The controller responds `{ success: true, data: { page, totalPages, results } }`.
7. React stores it in state and renders `MovieGrid`.

### Searching

1. The user types. The input updates immediately (controlled state).
2. `useDebounce` waits 500ms after the last keystroke.
3. The debounced value is written into the URL: `/search?query=batman&page=1`.
4. A `useEffect` watching the URL fires the request with an `AbortController`,
   so an older in-flight request is cancelled when a newer one starts.
5. Results replace the grid; previous results stay visible while loading.

### Adding to the wishlist

1. On first load the browser generates a UUID and stores it in `localStorage`
   under `anonymousUserId`.
2. Clicking the heart sends `POST /api/wishlist` with that id plus a small
   movie snapshot.
3. `wishlistService` writes to MongoDB. A compound unique index on
   `anonymousUserId + movieId` prevents duplicates (returns `409`).

---

## 4. API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Service + database status |
| GET | `/api/movies/trending?page=1` | Trending today |
| GET | `/api/movies/popular?page=1` | Popular movies |
| GET | `/api/movies/top-rated?page=1` | Top rated |
| GET | `/api/movies/upcoming?page=1` | Upcoming |
| GET | `/api/movies/genres` | Genre list (for the filter bar) |
| GET | `/api/movies/search?query=batman&page=1` | Search |
| GET | `/api/movies/discover?genre=28&year=2025&sort=rating&page=1` | Filter + sort |
| GET | `/api/movies/:id` | Movie details |
| GET | `/api/wishlist?anonymousUserId=...` | Saved movies |
| POST | `/api/wishlist` | Add a movie |
| DELETE | `/api/wishlist/:movieId?anonymousUserId=...` | Remove a movie |

Every response uses the same envelope:

```json
{ "success": true, "data": { } }
{ "success": false, "message": "Movie not found" }
```

Status codes: `200` ok, `201` created, `400` invalid request, `404` not found,
`409` duplicate, `429` rate limited, `502` TMDB upstream failure, `500` unknown.

---

## 5. Database schema

Collection: `wishlists`

| Field | Type | Notes |
| --- | --- | --- |
| `anonymousUserId` | String | UUID from the browser, required, indexed |
| `movieId` | Number | TMDB movie id, required |
| `title` | String | Snapshot |
| `posterUrl` | String | Full image URL or `null` |
| `rating` | Number | Snapshot |
| `releaseDate` | String | `YYYY-MM-DD` or `null` |
| `savedAt` | Date | Defaults to now |

Indexes:

- `{ anonymousUserId: 1, movieId: 1 }` — **unique**, prevents duplicates.
- `{ anonymousUserId: 1, savedAt: -1 }` — fast "my wishlist, newest first".

---

## 6. Technical decisions

**Why store a movie snapshot instead of only the id?**
The wishlist page can render straight from MongoDB with one query. Without the
snapshot we would need one TMDB request per saved movie on every page load.
Tradeoff: if TMDB later changes a title or rating, the saved copy is slightly
stale. Acceptable here, and the details page always shows live data.

**Why an anonymous user id instead of login?**
Authentication is out of scope for the assignment. A UUID in `localStorage`
gives each browser its own wishlist with almost no code. Limitation: the
wishlist is per-browser/per-device and is lost if site data is cleared.

**Why a backend proxy at all?**
It keeps the TMDB key secret, lets us normalize and validate data in one place,
adds caching and rate limiting, and means the frontend has a single stable API.

**Why plain React state + custom hooks?**
The app has little shared state (only the wishlist, which uses React Context).
Redux would add ceremony without benefit.

**Why the URL as the source of truth for search?**
`/search?query=batman&page=2&genre=28` makes results shareable, makes the back
button work, and preserves search context when returning from a details page.

---

## 7. Caching

`server/src/utils/cache.js` is a tiny in-memory `Map` with a TTL (default 5
minutes, configurable via `CACHE_TTL_SECONDS`). Every TMDB GET is keyed by its
full path + query. This cuts repeat TMDB calls for popular endpoints and keeps
the app inside TMDB rate limits. It is per-process and clears on restart —
Redis would be the next step in production.

## 8. Error handling

- TMDB failures are caught in the service and re-thrown as an `ApiError` with a
  readable message; the client never sees a raw axios stack.
- All controllers are wrapped in `asyncHandler`, so rejected promises reach the
  central `errorHandler` middleware.
- Mongoose duplicate-key errors (`code 11000`) are translated into `409`.
- Invalid ids / missing query params are rejected with `400` before any I/O.
- The frontend shows an inline error card with a Retry button, and distinguishes
  loading / empty / error states everywhere.

## 9. Performance

- Debounced search (500ms) plus `AbortController` cancellation of stale requests.
- Server-side caching of TMDB responses.
- Lazy-loaded poster images with fixed aspect ratios (no layout shift).
- Previous results stay on screen while the next page loads.
- Compound MongoDB indexes for both wishlist queries.
- Only the fields the UI needs are sent to the client.

## 10. Assumptions

- Anonymous usage; no accounts.
- TMDB is reachable and the key is valid.
- MongoDB runs locally or via Atlas.
- Genre/year filtering uses TMDB `discover`, which (like TMDB itself) does not
  support combining a text query with filters — so filters apply to discovery
  browsing and the search page filters the active result set by year/genre.

## 11. Known limitations

- Wishlist is per-browser and lost if localStorage is cleared.
- In-memory cache is not shared across server instances.
- Rate limiting is per-process and in-memory.
- Snapshot data can drift from TMDB over time.
- No automated test suite.

## 12. AI usage

AI assistance was used to scaffold boilerplate (Express wiring, Tailwind setup,
README structure) and to review error handling. All architecture decisions,
data modelling, and the TMDB integration approach were reviewed and adjusted by
hand; every file is written to be readable and explainable.

## 13. Future improvements

- Real accounts (JWT) so wishlists follow the user across devices.
- Redis cache + shared rate limiting.
- Infinite scroll as an alternative to pagination.
- Movie trailers, cast, and recommendations on the details page.
- Unit tests (Jest/Supertest) and Playwright end-to-end tests.
- Docker Compose for one-command local setup.
