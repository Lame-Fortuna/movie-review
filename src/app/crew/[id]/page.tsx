import type { Metadata } from "next";
import Image from "next/image";

import MovieCard from "@/components/MovieCards";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, createMetadata } from "@/lib/metadata";
import movieLists from "@/lib/MovieLists.json";
import type { Movie, MovieApiResponse } from "@/lib/types";

type Params = Promise<{ id: string }>;

type TmdbPerson = {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  known_for_department?: string;
  profile_path?: string | null;
};

type TmdbMovieCredit = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  character?: string;
  job?: string;
  department?: string;
  popularity?: number;
};

type TmdbMovieCredits = {
  cast?: TmdbMovieCredit[];
  crew?: TmdbMovieCredit[];
};

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;
const MOVIE_API_BASE = "https://my-app.classic-mdb.workers.dev/api/movies";

function getTmdbApiKey() {
  return process.env.TMDB_API_KEY || process.env.TMDB_KEY || process.env.TMDB_key;
}

function getTmdbBearerToken() {
  return process.env.TMDB_BEARER_TOKEN || process.env.TMDB_ACCESS_TOKEN;
}

function tmdbImage(path?: string | null, size = "w500") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

function yearFromDate(date?: string) {
  const year = date?.slice(0, 4);
  return year && /^\d{4}$/.test(year) ? Number(year) : undefined;
}

function formatLifeDates(person: Partial<TmdbPerson>) {
  if (person.birthday && person.deathday) return `${person.birthday} - ${person.deathday}`;
  return person.birthday || person.deathday || null;
}

function toMovie(credit: TmdbMovieCredit): Movie | null {
  const title = credit.title || credit.original_title;

  if (!credit.id || !title) {
    return null;
  }

  return {
    tmdb_id: credit.id,
    title,
    original_title: credit.original_title,
    release_date: credit.release_date,
    year: yearFromDate(credit.release_date),
    poster: tmdbImage(credit.poster_path),
    backdrop: tmdbImage(credit.backdrop_path, "w1280") || undefined,
    plot_summary: credit.overview,
    ratings: typeof credit.vote_average === "number" ? { tmdb_rating: credit.vote_average } : undefined,
  };
}

function dedupeCredits(credits: TmdbMovieCredit[] = []) {
  const seen = new Set<number>();

  return credits
    .filter((credit) => {
      if (!credit.id || seen.has(credit.id)) {
        return false;
      }

      seen.add(credit.id);
      return true;
    })
    .sort((a, b) => {
      const aYear = yearFromDate(a.release_date) ?? 0;
      const bYear = yearFromDate(b.release_date) ?? 0;

      if (aYear !== bYear) {
        return bYear - aYear;
      }

      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
}

async function fetchTmdb<T>(path: string): Promise<{ data: T | null; error: string | null }> {
  const bearerToken = getTmdbBearerToken();
  const apiKey = getTmdbApiKey();
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");

  const headers: HeadersInit = {
    accept: "application/json",
  };

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  } else if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  } else {
    const error = "TMDB credentials are missing.";
    console.error(error);
    return { data: null, error };
  }

  try {
    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: TMDB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      const error = `TMDB request failed with status ${response.status}.`;
      console.error(`${error} Path: ${path}`);
      return { data: null, error };
    }

    return { data: (await response.json()) as T, error: null };
  } catch (error) {
    console.error(`TMDB request failed: ${path}`, error);
    return {
      data: null,
      error: "TMDB is temporarily unreachable from this network.",
    };
  }
}

async function fetchCrewPageData(id: string) {
  const [personResult, creditsResult] = await Promise.all([
    fetchTmdb<TmdbPerson>(`/person/${id}`),
    fetchTmdb<TmdbMovieCredits>(`/person/${id}/movie_credits`),
  ]);
  const person = personResult.data;
  const credits = creditsResult.data;
  const errors = [personResult.error, creditsResult.error].filter(Boolean) as string[];

  const fallbackPerson: TmdbPerson = {
    id: Number(id) || 0,
    name: `Crew Member #${id}`,
    biography: undefined,
    profile_path: null,
  };

  return {
    person: person?.id ? person : fallbackPerson,
    castCredits: dedupeCredits(credits?.cast),
    crewCredits: dedupeCredits(credits?.crew),
    hasTmdbPerson: Boolean(person?.id),
    errors,
  };
}

async function fetchAvailableMovies() {
  try {
    const response = await fetch(`${MOVIE_API_BASE}?page=1`, {
      headers: {
        "x-api-key": process.env.MOVIE_API_KEY || "",
        "Content-Type": "application/json",
      },
      next: { revalidate: 6 * 60 * 60 },
    });

    if (!response.ok) {
      return movieLists.IMDB35.slice(15, 23) as Movie[];
    }

    const data = (await response.json()) as MovieApiResponse;
    return data.results?.slice(0, 8) || (movieLists.IMDB35.slice(15, 23) as Movie[]);
  } catch (error) {
    console.error("[CrewPage] Failed to fetch fallback movies", error);
    return movieLists.IMDB35.slice(15, 23) as Movie[];
  }
}

function CreditGrid({
  credits,
  role,
}: {
  credits: TmdbMovieCredit[];
  role: "cast" | "crew";
}) {
  if (credits.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4">
      {credits.map((credit) => {
        const movie = toMovie(credit);
        const note = role === "cast" ? credit.character : credit.job;

        if (!movie) {
          return null;
        }

        return (
          <div key={`${role}-${credit.id}`} className="w-32 space-y-2 md:w-48">
            <MovieCard movie={movie} />
            {note ? (
              <p className="truncate px-1 font-label text-[11px] uppercase tracking-[0.18em] text-neutral-500" title={note}>
                {note}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function EmptyCredits({ label }: { label: string }) {
  return (
    <div className="border border-zinc-900 bg-zinc-950 px-6 py-10 text-center">
      <p className="font-body text-sm italic text-neutral-500">
        {label} are temporarily unavailable.
      </p>
    </div>
  );
}

function ErrorNotice({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-zinc-900 py-8">
      <div className="space-y-3 border border-amber-500/20 bg-amber-950/20 p-5">
        <h2 className="font-label text-xs uppercase tracking-[0.3em] text-amber-200">
          Credits Temporarily Limited
        </h2>
        <p className="font-body text-sm leading-relaxed text-neutral-300">
          TMDB is not reachable from this network right now, so this crew profile may be missing biography or credit data.
        </p>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {Array.from(new Set(errors)).join(" ")}
        </p>
      </div>
    </section>
  );
}

function AvailableMoviesFallback({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8 pb-10">
      <div className="flex flex-col gap-2 border-b border-white/50 pb-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
          Watch These Meanwhile
        </h2>
        <p className="font-body text-sm italic text-neutral-500">
          Available movies from the Film Atlas archive.
        </p>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.tmdb_id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchCrewPageData(params.id);

  if (!data.hasTmdbPerson) {
    return createMetadata({
      title: "Filmography",
      description: "Browse Film Atlas movie credits and classic movie recommendations.",
      path: `/crew/${params.id}`,
    });
  }

  const { person, castCredits, crewCredits } = data;
  const creditCount = castCredits.length + crewCredits.length;
  const description = `${person.name} filmography, movie credits, roles, and credited works on ${SITE_NAME}. Browse ${creditCount} credited movies.`;
  const profileImage = tmdbImage(person.profile_path, "w780") || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/crew/${person.id}`;

  return {
    title: `${person.name} Movies & Credits`,
    description,
    keywords: [
      person.name,
      `${person.name} movies`,
      `${person.name} filmography`,
      `${person.name} credits`,
      "movie credits",
      "filmography",
      SITE_NAME,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title: `${person.name} Movies & Credits`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: profileImage, alt: `${person.name} profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} Movies & Credits`,
      description,
      images: [profileImage],
    },
  };
}

export default async function CrewPage(props: { params: Params }) {
  const params = await props.params;
  const data = await fetchCrewPageData(params.id);
  const fallbackMovies = data.errors.length > 0 ? await fetchAvailableMovies() : [];
  const { person, castCredits, crewCredits, errors } = data;
  const profileImage = tmdbImage(person.profile_path, "w500");
  const lifeDates = formatLifeDates(person);

  return (
    <main className="mx-auto min-h-screen w-[95%] max-w-7xl py-16 text-on-surface md:py-24">
      <header className="flex flex-col gap-8 border-b border-zinc-800 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-surface-container-high">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={person.name}
                width={144}
                height={216}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
          <span className="font-headline text-4xl font-bold text-neutral-400">
                {person.name.slice(0, 1)}
              </span>
            )}
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="space-y-2">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
                Filmography
              </p>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white md:text-6xl">
                {person.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-xs uppercase tracking-[0.2em] text-neutral-500">
              {person.known_for_department ? <span>{person.known_for_department}</span> : null}
              {lifeDates ? <span>{lifeDates}</span> : null}
              {person.place_of_birth ? <span>{person.place_of_birth}</span> : null}
            </div>
          </div>
        </div>

        <p className="font-label text-xs uppercase tracking-[0.2em] text-neutral-600">
          {castCredits.length + crewCredits.length} credited works
        </p>
      </header>

      {person.biography ? (
        <section className="max-w-4xl border-b border-zinc-900 py-8">
          <p className="font-body text-base italic leading-relaxed text-neutral-400">
            {person.biography}
          </p>
        </section>
      ) : null}

      <ErrorNotice errors={errors} />

      <section className="space-y-8 py-10">
        <div className="flex items-end justify-between border-b border-white/50 pb-4">
          <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
            Acting Credits
          </h2>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-neutral-600">
            {castCredits.length}
          </span>
        </div>
        {castCredits.length > 0 ? (
          <CreditGrid credits={castCredits} role="cast" />
        ) : (
          <EmptyCredits label="Acting credits" />
        )}
      </section>

      <section className="space-y-8 pb-10">
        <div className="flex items-end justify-between border-b border-white/50 pb-4">
          <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
            Crew Credits
          </h2>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-neutral-600">
            {crewCredits.length}
          </span>
        </div>
        {crewCredits.length > 0 ? (
          <CreditGrid credits={crewCredits} role="crew" />
        ) : (
          <EmptyCredits label="Crew credits" />
        )}
      </section>

      <AvailableMoviesFallback movies={fallbackMovies} />
    </main>
  );
}
