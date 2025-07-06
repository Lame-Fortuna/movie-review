# Filmphile - Movie Review Platform | [Live](https://film-atlas.onrender.com/)


**Filmphile** is a full-stack movie review platform built with **Next.js**, **MongoDB**, **JavaScript**, **Tailwind CSS**, and integrated with the **TMDB API**. The platform enables real-time movie search, reviews, and personalized recommendations.

## Technologies Used
- **Next.js** (Full-stack)
- **MongoDB** (Database)
- **JavaScript**
- **Tailwind CSS** & **DaisyUI** (UI Styling)
- **TMDB API** (Movie Metadata)
- **FastAPI** (Microservice for Recommendations)
- **KMeans Clustering** (Movie Recommendations)

## Features
- **Real-Time Search**: Search movies by **keywords** or **genres** via TMDB API for accurate, up-to-date data.
- **User Reviews**: Submit, view, and filter movie reviews with live updates.
- **Movie Recommendations**: Personalized suggestions powered by a **FastAPI microservice** using KMeans clustering.
- **Responsive UI**: Fully responsive design, powered by Tailwind CSS and DaisyUI.

## System Architecture
- **Frontend**: Next.js handles SSR and dynamic routing for smooth UX.
- **Backend**: Custom-built API routes in Next.js for fetching data from MongoDB and the TMDB API.
- **Microservice**: A **FastAPI** microservice provides personalized movie recommendations based on KMeans clustering.
- **Database**: MongoDB stores user reviews, movie data, and recommendations with optimized query indexes.

## API Integration
The **TMDB API** provides data for over **130,000 movies**, enabling real-time search results and movie details such as:
- Titles, genres, release dates, ratings, cast, and posters.

## Movie Recommendation System
- **FastAPI Microservice**: A dedicated **FastAPI** microservice serves personalized recommendations based on KMeans clustering of movie metadata.
- API serves recommendations dynamically based on user preferences and movie data.

## Frontend Implementation
- Modular **React** components for scalability.
- **Dynamic Routing** for individual movie and profile pages.
- **Tailwind CSS** & **DaisyUI** for a responsive, intuitive UI.

---

Feel free to contribute or open an issue for feedback!
