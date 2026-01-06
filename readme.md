# Film Atlas | [Live](https://filmatlas.online/)

**Film Atlas** is a full-stack movie streaming, discovery and review platform built with **Next.js**. It integrates the **TMDB API** for real-time movie metadata, featuring a comprehensive catalog of over **130,000** titles. The platform includes advanced functionality such as a **Clustering-based Recommendation System**, an embedded streaming feature via **archive.org**, a **keyword and genre search**, a **user review system** and **curated catalogue pages**.

The system handles real-time searches and large-scale data efficiently using **Next.js**. User-generated reviews are stored and managed with **MongoDB** for scalability and reliability.

### Key Features

* **Real-Time Movie Metadata**: Integrates the **TMDB API** to provide metadata for over **130,000** movies, including titles, descriptions, release dates, genres, and more.

* **Clustering-based Recommendation System**: A fast, independent **FastAPI** service provides personalized movie recommendations based on content similarity. Over **18,000 titles** are available in the recommendation engine, offering accurate, high-speed suggestions.

* **Streaming via Archive.org**: Embedded video content from **archive.org** for accessible and legal movie streaming.

* **Keyword & Genre Search**: Robust search functionality enables users to find movies based on keywords and genres, powered by the **TMDB API**.

* **User Review System**: Allows users to submit reviews and ratings for movies. Reviews are stored and managed in **MongoDB**, offering efficient, scalable data storage.

* **Full-Stack with Next.js**: Built using **Next.js** for high-performance, SEO-friendly applications. Next.js optimizes the user experience by enabling features like server-side rendering (SSR) and static site generation (SSG).

* **Performance Optimized**: Utilizes **Next.js**'s static optimization and API routes for server-side logic, ensuring fast load times and an efficient user experience.


### Architecture

* **Frontend**: The frontend is built with **React** using the **Next.js** framework to ensure performance and SEO optimization. The application is fully responsive for desktop and mobile users.

* **Backend**: The backend includes multiple components:

  * **FastAPI Recommendation Service**: A separate, independently running **FastAPI** service powers the movie recommendation engine, delivering high-performance clustering-based recommendations in real-time.
  * **TMDB API**: The **TMDB API** is used for fetching movie metadata.
  * **MongoDB**: **MongoDB** stores user reviews and other data, enabling seamless scaling.

### Recommendation Engine

The **Clustering-based Recommendation System** is powered by a custom **FastAPI** service. This API uses a **clustering algorithm** to recommend movies based on content similarity, analyzing over **18,000 movies**. By separating the recommendation system into its own API, we ensure that it can scale independently and perform quickly under heavy load.

* **FastAPI** provides fast, asynchronous responses, allowing the recommendation engine to scale efficiently as the platform grows.
* The system ensures that movie suggestions are personalized, helping users discover movies they might enjoy based on similar content.

### Tech Stack

* **Next.js**: Full-stack framework for building React applications with server-side rendering, static site generation, and API routes.
* **FastAPI**: High-performance API for the recommendation system, handling movie suggestions based on content clustering.
* **TMDB API**: Provides comprehensive metadata for over 130,000 movies.
* **MongoDB**: NoSQL database used for managing user reviews and other data.
* **Archive.org**: Used to provide streaming of publicly available movies.

### Acknowledgements

* **TMDB API**: For providing comprehensive movie metadata.
* **Archive.org**: For offering free and legal streaming content.

