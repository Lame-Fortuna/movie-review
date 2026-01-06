import LegalLayout from "@/app/components/LegalLayout";

export default function DMCAPage() {
  return (
    <LegalLayout title="DMCA Notice">
      <p>
        Film Atlas respects the intellectual property rights of others and
        expects users of the site to do the same.
      </p>

      <p>
        Film Atlas does not host any video files. All media content is embedded
        from third-party public platforms, such as archive.org.
      </p>

      <p>
        If you believe that content available through Film Atlas infringes your
        copyright, you may submit a DMCA takedown notice to:
      </p>

      <a href="mailto:dmca@filmatlas.online" className="font-medium text-orange-400">
        dmca@filmatlas.online
      </a>

      <p>
        Please include sufficient information to identify the copyrighted work,
        the allegedly infringing material, and proof of ownership.
      </p>

      <p>
        Upon receipt of a valid notice, we will promptly review and take
        appropriate action.
      </p>
    </LegalLayout>
  );
}
