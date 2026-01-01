import LegalLayout from "@/app/components/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Film Atlas values your privacy. We do not collect personal information,
        require user accounts, or use tracking cookies.
      </p>

      <p>
        Anonymous reviews may be submitted with automatically generated
        usernames. No personally identifiable information is required or stored.
      </p>

      <p>
        Basic server-side analytics may be used to understand general traffic
        patterns. These analytics do not identify individual users.
      </p>

      <p>
        We do not sell, share, or trade user data with third parties.
      </p>
    </LegalLayout>
  );
}
