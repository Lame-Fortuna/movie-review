export function slugifyMovieTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "movie";
}

export function movieHref(id: number, title: string) {
  return `/movies/${id}/${slugifyMovieTitle(title)}`;
}