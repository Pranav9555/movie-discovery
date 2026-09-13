# 🎬 Movie Discovery App

A full-stack movie discovery application that allows users to discover movies, search for titles, explore movie details, filter and sort results, and maintain a persistent wishlist.
---

## ✨ Features

* Browse movies without searching
* Trending, popular, top-rated, and upcoming movies
* Search movies by title
* Filter movies by genre and release year
* Sort movies by popularity, rating, release date, and title
* Pagination for large movie collections
* Movie details page
* Add/remove movies from wishlist
* Wishlist persists after page refresh and browser restart
* Responsive design for different screen sizes
* Loading, empty, and error states
* Backend API abstraction between frontend and TMDB
* Server-side caching for repeated TMDB requests
* API validation and error handling
* TMDB rate-limit and timeout handling

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* Axios
* REST API

### Database

* MongoDB
* Mongoose

### External API

* TMDB (The Movie Database) API


# 🚀 Setup Instructions

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd movie-discovery-app
```

---

## 2. Install frontend dependencies

```bash
cd client
npm install
```

---

## 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 4. Create environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

Also in Client create .env 
VITE_API_BASE_URL=http://localhost:5000/api


---

## 5. Start the backend

From the `server` directory:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 6. Start the frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🏗️ Approach Taken

The application follows a **client-server architecture**.

```text
React Frontend
      │
      │ HTTP Requests
      ▼
Node.js + Express Backend
      │
      ├──────────────► TMDB API
      │
      └──────────────► MongoDB
```

The frontend does not communicate directly with TMDB.

Instead, requests go through the backend:

```text
React
  ↓
Express API
  ↓
Movie Service
  ↓
TMDB API
```

Wishlist operations use:

```text
React
  ↓
Express API
  ↓
Wishlist Service
  ↓
MongoDB
```

This keeps the external API key secure and gives the backend control over validation, normalization, caching, error handling, and rate limiting.

---

# 🔌 API Design

The backend exposes REST endpoints for the frontend.

### Movie endpoints

```text
GET /api/movies/trending
GET /api/movies/popular
GET /api/movies/top-rated
GET /api/movies/upcoming
GET /api/movies/search
GET /api/movies/discover
GET /api/movies/:id
GET /api/movies/genres
```

### Wishlist endpoints

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:movieId
```

### Health endpoint

```text
GET /api/health
```

---

# 🧠 Important Technical Decisions

## 1. Backend abstraction for TMDB

The frontend never calls TMDB directly.

All movie requests are handled by the Express backend.

This provides:

* API key protection
* Centralized error handling
* Response normalization
* Caching
* Rate-limit handling
* Easier replacement of the movie API in the future

---

## 2. MongoDB for wishlist persistence

MongoDB was selected because the application already uses a Node/Express stack and movie wishlist data is well suited to a document database.

Wishlist data is stored on the server so that it can survive:

* Page refreshes
* Browser restarts
* Navigation between pages

---

## 3. Server-side caching

Repeated TMDB requests are cached on the backend.

For example, if multiple users request the same popular movies page within a short period, the server can reuse the cached response instead of repeatedly requesting TMDB.

This helps reduce:

* External API requests
* Response time
* TMDB API usage

---

## 4. Response normalization

TMDB responses are converted into a consistent structure before being returned to the frontend.

This keeps the React components independent of the exact structure of the external API.

If the external API response changes, the movie service can be updated without requiring major frontend changes.

---

## 5. Error handling

The backend handles different external API failures separately, including:

* Invalid API key
* Movie not found
* TMDB rate limits
* Request timeout
* TMDB server errors
* Network failures

The frontend then displays appropriate loading, error, or empty states.

---

## 6. Pagination

Movie lists use pagination rather than loading an unlimited number of movies at once.

This helps keep the application responsive when working with large movie collections.

---

## 7. Anonymous wishlist identification

The application supports wishlist functionality without requiring users to create an account.

An anonymous user identifier is used to associate wishlist items with the browser/user session.

This allows wishlist data to remain persistent without implementing a complete authentication system.

---

# 📌 Assumptions Made

* TMDB is available as the external movie data provider.
* Users can browse movies without creating an account.
* An anonymous user identifier is sufficient for wishlist functionality for this assignment.
* TMDB provides the required movie metadata such as title, poster, overview, rating, release date, and genres.
* TMDB may occasionally be unavailable or rate-limit requests, so the application should provide graceful error feedback.
* The application is primarily intended for modern desktop and mobile browsers.
* Movie availability and metadata depend on the TMDB API.

---

# ⚠️ Known Limitations

* The wishlist is anonymous and is not connected to a permanent user account.
* Clearing browser storage or changing the anonymous identifier can cause the user to lose access to their previous wishlist.
* TMDB availability and rate limits can affect movie data loading.
* Server-side caching is currently simple and in-memory, so cached data is lost whenever the backend server restarts.
* The application does not currently include user authentication.
* The application does not provide streaming links or information about where movies can legally be watched.
* Search and movie information depend on the quality and completeness of TMDB data.
* There is currently no large-scale distributed caching layer.

---

# 🤖 AI Tools Used

AI tools were used during development as a development assistant rather than as a replacement for understanding the implementation.

### Lovable

Lovable was used initially to:

* Explore the application architecture
* Generate the initial frontend structure
* Create UI components and layouts
* Generate initial boilerplate
* Explore implementation ideas

The generated project was then reviewed and modified to fit the required architecture and technology stack.

### ChatGPT

ChatGPT was used for:

* Architecture planning
* Breaking the assignment into smaller implementation steps
* Debugging
* Understanding errors
* Reviewing API integration
* Improving README/documentation
* Generating and reviewing boilerplate code
* Discussing technical decisions and edge cases

### Cursor / VS Code

Cursor/VS Code was used to continue development and modify the generated code after the initial AI-generated implementation.

All generated code was reviewed and adapted as needed, and the implementation decisions were made with an understanding of how the application works.

---

# 🔐 Security Considerations

* TMDB API credentials are stored only on the backend.
* Environment variables are used for sensitive configuration.
* `.env` files are excluded from Git.
* Frontend requests go through the backend instead of exposing the TMDB API key.
* API inputs are validated before processing.
* External API errors are handled centrally.
* Rate limiting is considered to prevent excessive requests.

---

# 📱 Responsive Design

The UI is designed to work across different screen sizes.

The application accounts for:

* Desktop screens
* Tablets
* Mobile devices
* Different poster dimensions
* Long movie titles
* Large movie result sets
* Empty results
* Slow network conditions
* API failures

---

# 🧪 Error & Loading States

The application provides feedback for different states:

### Loading

Displays loading indicators while movie data is being fetched.

### Empty

Displays an appropriate message when no movies match the current search/filter.

### Error

Displays an error message when the backend or TMDB cannot be reached.

### Slow/Unavailable API

The backend handles TMDB timeout and network errors and returns an appropriate response to the frontend.

---

# 🚧 What I Would Improve With Additional Time

If more development time were available, I would improve the application in the following areas:

### 1. Authentication

Add user authentication so wishlist data can be permanently associated with an account and accessed across different devices.

### 2. Better caching

Replace the current in-memory cache with Redis for production-scale caching.

### 3. Automated testing

Add:

* Unit tests
* API integration tests
* Component tests
* End-to-end tests

### 4. Better search experience

Improve search with:

* Search suggestions
* More advanced filters
* Better debouncing
* Search history
* More detailed sorting options

### 5. Performance improvements

Further optimize:

* Image loading
* API requests
* Pagination
* Component rendering
* Caching

### 6. Improved accessibility

Add more comprehensive keyboard navigation, screen-reader support, semantic HTML, and accessibility testing.

### 7. Production deployment

Deploy the frontend and backend using production infrastructure and configure:

* HTTPS
* Production environment variables
* Production database
* Distributed caching
* Monitoring and logging

---

# 📄 License

This project was created as a technical assignment and learning project.

Movie information and images are provided by **TMDB**.

---

# 👨‍💻 Author

**Pranav Phalke**

Full-Stack / MERN Developer

Technologies: React.js, Node.js, Express.js, MongoDB, JavaScript, Tailwind CSS
