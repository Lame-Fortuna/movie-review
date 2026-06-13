import type { Metadata } from "next";
import Image from "next/image";
import { permanentRedirect } from "next/navigation";

import MovieCard from "@/components/MovieCards";
import { personHref } from "@/lib/href";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, createMetadata } from "@/lib/metadata";
import movieLists from "@/lib/MovieLists.json";
import type { Movie, MovieApiResponse } from "@/lib/types";

type Params = Promise<{ id: string; slug: string }>;

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

type CrewMovie = Movie & {
  directors?: string[];
  actors?: string[];
  country?: string[];
  language?: string;
  audience_rating?: string;
};

type CrewMovieGroups = Record<string, CrewMovie[]>;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;
const MOVIE_API_BASE = "https://my-app.classic-mdb.workers.dev/api";

function getTmdbApiKey() {
  return process.env.TMDB_API_KEY || process.env.TMDB_KEY || process.env.TMDB_key;
}

function getTmdbBearerToken() {
  return process.env.TMDB_BEARER_TOKEN || process.env.TMDB_ACCESS_TOKEN;
}

function tmdbImage(path?: string | null, size = "w500") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

function formatLifeDates(person: Partial<TmdbPerson>) {
  if (person.birthday && person.deathday) return `${person.birthday} - ${person.deathday}`;
  return person.birthday || person.deathday || null;
}

function nameFromSlug(slug: string, id: string) {
  const name = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return name && name !== `Person ${id}` ? name : `Person #${id}`;
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

function isCrewMovie(value: unknown): value is CrewMovie {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as CrewMovie).tmdb_id === "number" &&
      typeof (value as CrewMovie).title === "string",
  );
}

function normalizeCrewGroups(payload: unknown): CrewMovieGroups {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const groups: CrewMovieGroups = {};

  for (const [role, movies] of Object.entries(payload)) {
    if (!Array.isArray(movies)) {
      continue;
    }

    const seen = new Set<number>();
    const normalized = movies
      .filter(isCrewMovie)
      .filter((movie) => {
        if (seen.has(movie.tmdb_id)) {
          return false;
        }

        seen.add(movie.tmdb_id);
        return true;
      })
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

    if (normalized.length > 0) {
      groups[role] = normalized;
    }
  }

  return groups;
}

async function fetchClassicCrewGroups(id: string): Promise<{ data: CrewMovieGroups; error: string | null }> {
  try {
    const response = await fetch(`${MOVIE_API_BASE}/movie/crew/${id}`, {
      headers: {
        "x-api-key": process.env.MOVIE_API_KEY || "",
        "Content-Type": "application/json",
      },
      next: { revalidate: 6 * 60 * 60 },
    });

    if (response.status === 404) {
      return {
        data: {},
        error: "No Film Atlas credits were found for this person yet.",
      };
    }

    if (!response.ok) {
      return {
        data: {},
        error: `Film Atlas credits failed with status ${response.status}.`,
      };
    }

    return {
      data: normalizeCrewGroups(await response.json()),
      error: null,
    };
  } catch (error) {
    console.error("[PersonPage] Failed to fetch classic-mdb person groups", error);
    return {
      data: {},
      error: "Film Atlas credits are temporarily unavailable.",
    };
  }
}

async function fetchPersonPageData(id: string, slug: string) {
  const [personResult, classicCreditsResult] = await Promise.all([
    fetchTmdb<TmdbPerson>(`/person/${id}`),
    fetchClassicCrewGroups(id),
  ]);
  const person = personResult.data;
  const movieGroups = classicCreditsResult.data;
  const tmdbErrors = [personResult.error].filter(Boolean) as string[];
  const filmAtlasErrors = [classicCreditsResult.error].filter(Boolean) as string[];
  const errors = [...tmdbErrors, ...filmAtlasErrors];

  const fallbackPerson: TmdbPerson = {
    id: Number(id) || 0,
    name: nameFromSlug(slug, id),
    biography: undefined,
    profile_path: null,
  };

  return {
    person: person?.id ? person : fallbackPerson,
    movieGroups,
    hasTmdbPerson: Boolean(person?.id),
    filmAtlasCreditsFailed: filmAtlasErrors.length > 0,
    errors,
  };
}

async function fetchAvailableMovies() {
  try {
    const response = await fetch(`${MOVIE_API_BASE}/movies?page=1`, {
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
    console.error("[PersonPage] Failed to fetch fallback movies", error);
    return movieLists.IMDB35.slice(15, 23) as Movie[];
  }
}

function roleLabel(role: string) {
  if (role === "actor") return "Acting Credits";
  if (role === "director") return "Directed";
  if (role === "writer") return "Writing Credits";

  return role
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function sortRoles(roles: string[]) {
  const preferred = ["actor", "director", "writer", "screenplay", "producer"];

  return [...roles].sort((a, b) => {
    const aIndex = preferred.indexOf(a);
    const bIndex = preferred.indexOf(b);

    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? preferred.length : aIndex) - (bIndex === -1 ? preferred.length : bIndex);
    }

    return a.localeCompare(b);
  });
}

function countUniqueMovies(groups: CrewMovieGroups) {
  return new Set(Object.values(groups).flat().map((movie) => movie.tmdb_id)).size;
}

function CreditGrid({ movies }: { movies: CrewMovie[] }) {
  return (
    <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <div key={movie.tmdb_id} className="w-32 space-y-2 md:w-48">
          <MovieCard movie={movie} />
        </div>
      ))}
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
          TMDB is not reachable from this network right now, so this person profile may be missing biography or credit data.
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
  const data = await fetchPersonPageData(params.id, params.slug);

  if (!data.hasTmdbPerson) {
    return createMetadata({
      title: "Filmography",
      description: "Browse Film Atlas movie credits and classic movie recommendations.",
      path: `/persons/${params.id}/${params.slug}`,
    });
  }

  const { person, movieGroups } = data;
  const creditCount = countUniqueMovies(movieGroups);
  const description = `${person.name} filmography, movie credits, roles, and credited works on ${SITE_NAME}. Browse ${creditCount} credited movies.`;
  const profileImage = tmdbImage(person.profile_path, "w780") || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}${personHref(person.id, person.name)}`;

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

export default async function PersonPage(props: { params: Params }) {
  const params = await props.params;
  const data = await fetchPersonPageData(params.id, params.slug);
  const expectedPath = personHref(data.person.id, data.person.name);

  if (data.hasTmdbPerson && `/persons/${params.id}/${params.slug}` !== expectedPath) {
    permanentRedirect(expectedPath);
  }

  const fallbackMovies = data.filmAtlasCreditsFailed ? await fetchAvailableMovies() : [];
  const { person, movieGroups, errors } = data;
  const roles = sortRoles(Object.keys(movieGroups));
  const creditCount = countUniqueMovies(movieGroups);
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
          {creditCount} credited works
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

      {roles.length > 0 ? (
        roles.map((role, index) => (
          <section key={role} className={`space-y-8 ${index === 0 ? "py-10" : "pb-10"}`}>
            <div className="flex items-end justify-between border-b border-white/50 pb-4">
              <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
                {roleLabel(role)}
              </h2>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-neutral-600">
                {movieGroups[role].length}
              </span>
            </div>
            <CreditGrid movies={movieGroups[role]} />
          </section>
        ))
      ) : (
        <section className="space-y-8 py-10">
          <div className="flex items-end justify-between border-b border-white/50 pb-4">
            <h2 className="font-label text-xs uppercase tracking-[0.3em] text-neutral-500">
              Film Atlas Credits
            </h2>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-neutral-600">
              0
            </span>
          </div>
          <EmptyCredits label="Film Atlas credits" />
        </section>
      )}

      <AvailableMoviesFallback movies={fallbackMovies} />
    </main>
  );
}
