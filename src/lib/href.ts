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

export function personHref(id: number, name: string) {
  return `/persons/${id}/${slugifyMovieTitle(name || `person-${id}`)}`;
}

export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tag";
}

export function tagFromSlug(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ").trim();
}

export function tagHref(tag: string) {
  return `/tag/${slugifyTag(tag)}`;
}
