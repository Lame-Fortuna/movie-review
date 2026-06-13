import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PersonIdRedirectPage({ params }: PageProps) {
  const { id } = await params;

  permanentRedirect(`/persons/${id}/person-${id}`);
}
