import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import MoviePageClient from "@/components/page/MoviePageClient";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  createMetadata,
} from "@/lib/metadata";
import { fetchMovieById } from "@/lib/moviePage";
import { personHref, slugifyMovieTitle } from "@/lib/href";
import type { Movie } from "@/lib/types";

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

const FILM_ATLAS_VIDEO_PUBLISHED_AT = "2026-01-07T00:00:00+05:30";

function uniqueStrings(values: Array<string | number | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.toString().trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );
}

function truncateDescription(value: string, maxLength = 165) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function getMovieSources(movie: Movie) {
  if (Array.isArray(movie.sources)) {
    return movie.sources.filter((source) => typeof source === "string" && source.trim());
  }

  return [];
}

function toIsoDuration(minutes?: number) {
  if (!minutes || minutes <= 0) {
    return undefined;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours ? `${hours}H` : ""}${remainingMinutes ? `${remainingMinutes}M` : ""}`;
}

function cleanDate(date?: string) {
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
}

function getCollectionName(movie: Movie) {
  return movie.collection?.name?.trim() || undefined;
}

function getRegionalKeywords(movie: Movie) {
  const languageCodes = uniqueStrings([
    movie.original_language,
    ...(movie.spoken_languages || []).map((language) => language.iso_639_1),
  ]).map((value) => value.toLowerCase());
  const languageNames = uniqueStrings(
    (movie.spoken_languages || []).flatMap((language) => [
      language.english_name,
      language.name,
    ]),
  ).map((value) => value.toLowerCase());
  const countryCodes = uniqueStrings(movie.production_countries?.split(",") || []).map((value) =>
    value.toLowerCase(),
  );
  const countryNames = uniqueStrings(movie.production_country_names || []).map((value) =>
    value.toLowerCase(),
  );
  const hasLanguage = (code: string, name: string) =>
    languageCodes.includes(code) || languageNames.some((value) => value.includes(name));
  const hasCountry = (code: string, name: string) =>
    countryCodes.includes(code.toLowerCase()) ||
    countryNames.some((value) => value.includes(name.toLowerCase()));

  if (hasLanguage("hi", "hindi") || hasCountry("in", "india")) {
    return ["classic hindi movies", "old bollywood movies", "classic bollywood movies online"];
  }

  if (hasLanguage("ja", "japanese") || hasCountry("jp", "japan")) {
    return ["classic japanese movies", "old japanese movies", "japanese classic cinema"];
  }

  if (hasLanguage("fr", "french") || hasCountry("fr", "france")) {
    return ["classic french movies", "old french cinema", "french classic movies"];
  }

  if (hasLanguage("de", "german") || hasCountry("de", "germany")) {
    return ["classic german movies", "old german cinema", "german expressionist movies"];
  }

  if (hasLanguage("ru", "russian") || hasCountry("ru", "russia")) {
    return ["classic russian movies", "soviet classic movies", "old russian cinema"];
  }

  if (hasLanguage("it", "italian") || hasCountry("it", "italy")) {
    return ["classic italian movies", "old italian cinema", "italian classic movies"];
  }

  return [];
}

function buildMovieDescription(movie: Movie, titleWithYear: string, hasFreeSource: boolean) {
  const genreText = movie.genres?.[0] ? `${movie.genres[0].toLowerCase()} ` : "";

  if (hasFreeSource) {
    return truncateDescription(
      `Watch ${titleWithYear} for free on ${SITE_NAME}. Stream this public domain ${genreText}classic movie with cast, reviews, ratings, and film details.`,
    );
  }

  const rawDescription = `${movie.plot_summary || movie.tagline || `${titleWithYear} movie details.`} Directed by ${movie.director || "Unknown"}. Starring ${movie.actors || "an ensemble cast"}.`;
  return truncateDescription(rawDescription);
}

function buildMovieKeywords(movie: Movie, titleWithYear: string, hasFreeSource: boolean) {
  const title = movie.title;
  const collectionName = getCollectionName(movie);
  const genreKeywords = (movie.genres || []).flatMap((genre) => [
    `${genre} classic movie`,
    `classic ${genre.toLowerCase()} movies`,
  ]);
  const collectionKeywords = collectionName
    ? [`${collectionName} movies`, `${collectionName} film series`]
    : [];

  const availabilityKeywords = hasFreeSource
    ? [
        `watch ${title} for free`,
        `watch ${title} online free`,
        `${title} public domain movie`,
        `${title} full movie`,
        "watch classic movies free",
        "public domain movies online",
        "free classic movies online",
      ]
    : [`${title} cast`, `${title} reviews`, `${title} ratings`];

  return uniqueStrings([
    title,
    titleWithYear,
    movie.original_title,
    movie.year,
    ...(movie.genres || []),
    ...genreKeywords,
    ...availabilityKeywords,
    ...collectionKeywords,
    ...getRegionalKeywords(movie),
    movie.director,
    collectionName,
    "golden classic movies",
    "classic vintage movies",
    "classic movie reviews",
    "film cast and credits",
    SITE_NAME,
  ]).slice(0, 35);
}

function buildJsonLd(movie: Movie, movieUrl: string, description: string, keywords: string[]) {
  const sources = getMovieSources(movie);
  const primarySource = sources[0];
  const image = movie.backdrop || movie.poster_original || movie.poster || movie.poster2 || DEFAULT_OG_IMAGE;
  const titleWithYear = movie.year ? `${movie.title} (${movie.year})` : movie.title;
  const duration = toIsoDuration(movie.runtime);
  const releaseDate = cleanDate(movie.release_date);
  const languages = uniqueStrings([
    movie.original_language,
    ...(movie.spoken_languages || []).map((language) => language.english_name),
  ]);
  const countries = movie.production_country_names?.map((country) => ({
    "@type": "Country",
    name: country,
  }));
  const directors = movie.credits?.directors?.map((director) => ({
    "@type": "Person",
    name: director.name,
    url: `${SITE_URL}${personHref(director.id, director.name)}`,
  }));
  const actors = movie.credits?.actors?.slice(0, 12).map((actor) => ({
    "@type": "Person",
    name: actor.name,
    url: `${SITE_URL}${personHref(actor.id, actor.name)}`,
  }));
  const aggregateRating =
    typeof movie.ratings?.tmdb_rating === "number" && movie.ratings.tmdb_votes
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.ratings.tmdb_rating.toFixed(1),
          ratingCount: movie.ratings.tmdb_votes,
          bestRating: "10",
          worstRating: "1",
        }
      : undefined;
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": `${movieUrl}#movie`,
    name: titleWithYear,
    alternateName: movie.original_title,
    url: movieUrl,
    description,
    image,
    thumbnailUrl: image,
    datePublished: releaseDate,
    duration,
    genre: movie.genres,
    inLanguage: languages,
    countryOfOrigin: countries,
    keywords: keywords.join(", "),
    director: directors,
    actor: actors,
    aggregateRating,
    isAccessibleForFree: Boolean(primarySource),
    potentialAction: primarySource
      ? {
          "@type": "WatchAction",
          target: movieUrl,
        }
      : undefined,
  };
  const videoSchema = primarySource
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": `${movieUrl}#video`,
        name: `Watch ${titleWithYear} for free`,
        description,
        thumbnailUrl: [image],
        uploadDate: FILM_ATLAS_VIDEO_PUBLISHED_AT,
        duration,
        embedUrl: primarySource,
        url: movieUrl,
        isAccessibleForFree: true,
        genre: movie.genres,
        inLanguage: movie.original_language,
        potentialAction: {
          "@type": "WatchAction",
          target: movieUrl,
        },
      }
    : null;

  return JSON.stringify(videoSchema ? [movieSchema, videoSchema] : movieSchema).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovieById(id);

  if (!movie) {
    return createMetadata({
      title: "Movie Not Found",
      description: "Browse classic movie details on Film Atlas.",
      path: `/movies/${id}`,
    });
  }

  const movieSlug = slugifyMovieTitle(movie.title);
  const movieUrl = `${SITE_URL}/movies/${movie.tmdb_id}/${movieSlug}`;
  
  const titleWithYear = movie.year ? `${movie.title} (${movie.year})` : movie.title;
  const sources = getMovieSources(movie);
  const hasFreeSource = sources.length > 0;
  const primarySource = sources[0];
  const description = buildMovieDescription(movie, titleWithYear, hasFreeSource);
  const keywords = buildMovieKeywords(movie, titleWithYear, hasFreeSource);

  // Grab the best available images safely
  const images = [movie.backdrop, movie.poster_original, movie.poster, movie.poster2, DEFAULT_OG_IMAGE]
    .filter(Boolean)
    .map((url) => ({ url: url as string, alt: `${movie.title} poster or backdrop` }));

  const robots = movie.restricted
    ? { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true }
    : { index: true, follow: true, "max-image-preview": "large" as const, "max-video-preview": -1 };

  return {
    title: hasFreeSource
      ? `Watch ${titleWithYear} for Free | Public Domain Classic Movie`
      : `${titleWithYear} | Cast, Reviews & Ratings`,
    description,
    keywords,
    authors: movie.credits?.directors?.map((d) => ({ name: d.name })) || [],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: movie.genres?.[0] || "Movies",
    alternates: { canonical: movieUrl },
    robots,
    openGraph: {
      type: "video.movie",
      title: titleWithYear,
      description,
      url: movieUrl,
      siteName: SITE_NAME,
      images,
      videos: primarySource
        ? [
            {
              url: primarySource,
              secureUrl: primarySource,
              type: "text/html",
            },
          ]
        : undefined,
      countryName: movie.production_countries?.split(",")[0],
      releaseDate: movie.release_date,
      locale: movie.original_language,
      tags: keywords.slice(0, 20),
    },
    twitter: {
      card: images[0] ? "summary_large_image" : "summary",
      title: hasFreeSource ? `Watch ${titleWithYear} for Free` : titleWithYear,
      description,
      images: images[0] ? [images[0].url] : undefined,
    },
    // Dump extra data cleanly into 'other' without mapping loops
    other: {
      "movie:status": movie.status || "",
      "movie:age_rating": movie.rated || "",
      "movie:imdb_id": movie.imdb_id || "",
      "movie:runtime": movie.runtime?.toString() || "",
      "movie:director": movie.director || "",
      "movie:country": movie.production_country_names?.join(", ") || movie.production_countries || "",
      "movie:language": movie.spoken_languages?.map((language) => language.english_name).join(", ") || movie.original_language || "",
      "video:duration": toIsoDuration(movie.runtime) || "",
      "video:release_date": movie.release_date || "",
      "video:tag": keywords.slice(0, 10).join(", "),
      "og:video": primarySource || "",
      "og:video:secure_url": primarySource || "",
      "og:video:type": primarySource ? "text/html" : "",
    },
  };
}

export default async function MovieSlugPage({ params }: PageProps) {
  const { id, slug } = await params;
  const movie = await fetchMovieById(id);

  if (!movie) {
    notFound();
  }

  const expectedSlug = slugifyMovieTitle(movie.title);

  if (slug !== expectedSlug) {
    permanentRedirect(`/movies/${movie.tmdb_id}/${expectedSlug}`);
  }

  const movieUrl = `${SITE_URL}/movies/${movie.tmdb_id}/${expectedSlug}`;
  const titleWithYear = movie.year ? `${movie.title} (${movie.year})` : movie.title;
  const hasFreeSource = getMovieSources(movie).length > 0;
  const description = buildMovieDescription(movie, titleWithYear, hasFreeSource);
  const keywords = buildMovieKeywords(movie, titleWithYear, hasFreeSource);
  const jsonLd = buildJsonLd(movie, movieUrl, description, keywords);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <MoviePageClient movie={movie} />
    </>
  );
}
