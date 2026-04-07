import LegalLayout from "@/components/LegalLayout";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact Film Atlas for support, feedback, or general questions.",
  path: "/legal/contact",
});

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        For general questions, feedback, or support inquiries, please contact us
        at: <a href="mailto:support@filmatlas.online" className="ml-2 font-medium text-orange-400">support@filmatlas.online</a>
      </p>

      <p>
        For copyright-related concerns, please refer to our DMCA Notice page for
        the appropriate contact information.
      </p>
    </LegalLayout>
  );
}
