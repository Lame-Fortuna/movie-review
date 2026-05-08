# Film Atlas | [Live](https://filmatlas.online/)

**Film Atlas** is a full-stack platform for streaming, discovering, and reviewing public domain vintage movies, built with **Next.js**. It is powered by **Classic-MDB**, a self-built metadata API, covering 500+ titles with embedded streaming, a clustering-based recommendation system, advanced search, and a verified review system.

---

### Key Features

- **Custom Metadata API ([Classic-MDB](https://github.com/Lame-Fortuna/classic-mdb))**: Self-built API deployed on **Cloudflare Workers**. Serves cast, plot, posters, trivia, critic reviews, budget, and box office data. Metadata is enriched via an **[LLM-based Wikipedia scraper](https://github.com/Lame-Fortuna/wikipediaExtract)** built to extract data not available through existing public APIs. Supports search by term, genre, and cast across 500+ titles. Deployed independently from the frontend to allow metadata to be updated without redeployment.

- **[Clustering-based Recommendation System](https://huggingface.co/spaces/L0w1/movie_reco)**: Standalone **FastAPI** microservice providing content-similarity-based recommendations across 500+ titles. Kept as a separate Python service to isolate ML dependencies from the Node.js application stack.

- **Streaming**: Embedded playback sourced from **Archive.org** and **Wikimedia Commons**, with select titles served via CDN. 150+ public domain films available to stream directly on the platform.

- **Review System**: Users can submit reviews and ratings. Submissions are verified with **Cloudflare Turnstile** bot protection. Reviews are stored in **MongoDB**.

- **Caching**: Uses **Next.js `unstable_cache`** and **`next revalidate`** on data fetches to reduce redundant API calls and improve response times.

- **Full-Stack with Next.js**: SSR, SSG, and API routes. Deployed on **Vercel**. Fully responsive across desktop and mobile.

---

### Architecture

**Frontend**: **React** with **Next.js (App Router)**. SSR with CSR for dynamic content. Deployed on **Vercel**..

**Backend**:
- **[Classic-MDB API](https://github.com/Lame-Fortuna/classic-mdb)**: Self-built metadata API on **Cloudflare Workers**. Primary source for all movie data, search, and discovery. Independently deployed so metadata updates do not require a frontend redeployment cycle.
- **[FastAPI Recommendation Service](https://huggingface.co/spaces/L0w1/movie_reco)**: Standalone Python microservice running the clustering-based recommendation engine. ML dependencies are kept isolated from the Node.js stack.
- **MongoDB**: Stores user reviews and ratings.

---

### Recommendation Engine

Standalone **FastAPI** service deployed on **Hugging Face Spaces**. Uses content-similarity clustering across 500+ titles to return personalized recommendations. Runs as a separate Python microservice, keeping ML dependencies out of the Node.js application stack and allowing the service to scale independently.

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js** (SSR, SSG, API Routes) |
| Deployment | **Vercel** |
| Metadata API | **[Classic-MDB](https://github.com/Lame-Fortuna/classic-mdb)** (self-built, Cloudflare Workers) |
| Data Enrichment | **[LLM-based Wikipedia scraper](https://github.com/Lame-Fortuna/wikipediaExtract)** (trivia, critic reviews, budget, box office) |
| Recommendation Engine | **[FastAPI](https://huggingface.co/spaces/L0w1/movie_reco)** (clustering-based, Hugging Face Spaces) |
| Database | **MongoDB** |
| Bot Protection | **Cloudflare Turnstile** |
| Caching | **Next.js `unstable_cache`** + **`next revalidate`** |
| Streaming | **Archive.org**, **Wikimedia Commons** (select titles via CDN) |

---

### Acknowledgements

- **Archive.org** for public domain film hosting and streaming.
- **Wikimedia Commons** for additional public domain media content.
- **Cloudflare Workers** for edge deployment of the Classic-MDB API.