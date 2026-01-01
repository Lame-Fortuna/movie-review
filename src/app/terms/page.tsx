import LegalLayout from "@/app/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        Film Atlas is provided for informational, educational, and entertainment
        purposes only.
      </p>

      <p>
        Film Atlas does not host or upload any media files. Embedded content is
        sourced from third-party platforms that make such content publicly
        available.
      </p>

      <p>
        Users may submit text-based reviews. You retain ownership of your
        content, but grant Film Atlas permission to display it on the site.
      </p>

      <p>
        Film Atlas makes no guarantees regarding content availability or
        accuracy and reserves the right to modify or remove content at any time.
      </p>

      <p>
        By using this website, you agree to use it responsibly and in compliance
        with applicable laws.
      </p>
    </LegalLayout>
  );
}
