import LegalLayout from "@/app/components/LegalLayout";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        For general questions, feedback, or support inquiries, please contact us
        at:
      </p>

      <a href="mailto:dmca@filmatlas.online" className="font-medium text-orange-400">support@filmatlas.online</a>

      <p>
        For copyright-related concerns, please refer to our DMCA Notice page for
        the appropriate contact information.
      </p>
    </LegalLayout>
  );
}
