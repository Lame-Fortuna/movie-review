import LegalLayout from "@/app/components/LegalLayout";

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer">
      <p>
        Film Atlas is an informational and educational platform designed to help
        users discover, explore, and learn about movies and television shows.
      </p>

      <p>
        Film Atlas does not host, store, upload, or distribute any video or media
        files. All embedded media content is provided by third-party platforms that make such
        content publicly available, including the Internet Archive.
      </p>

      <p>
        Film Atlas is not affiliated with, endorsed by, or sponsored by any
        movie studios, production companies, or streaming services unless
        explicitly stated.
      </p>

      <p>
        Metadata such as titles, descriptions, posters, and release information
        is sourced from third-party databases (e.g., The Movie Database – TMDB, OMDB)
        and is used for informational purposes only.
      </p>

      <p>
        While we strive to keep information accurate and up to date, Film Atlas
        makes no warranties or guarantees regarding the completeness,
        reliability, or availability of any content on the site.
      </p>

      <p>
        Use of this website is at your own discretion and risk. Film Atlas shall
        not be held liable for any damages, losses, or legal issues arising from
        the use of third-party content or external links.
      </p>
    </LegalLayout>
  );
}
