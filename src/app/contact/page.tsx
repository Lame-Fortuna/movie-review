import LegalLayout from "@/app/components/LegalLayout";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        For general questions, feedback, or support inquiries, please contact us
        at:
      </p>

      <p className="font-medium">support@filmatlas.online</p>

      <p>
        For copyright-related concerns, please refer to our DMCA Notice page for
        the appropriate contact information.
      </p>
    </LegalLayout>
  );
}
