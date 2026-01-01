import fs from "fs";
import path from "path";
import CatalogueClient from "./CatalogueClient";

type PageProps = {
  params: {
    name: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { name } = await params;

  const filePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "catalogues",
    `${name}.json`
  );

  if (!fs.existsSync(filePath)) {
    return <div>no such catalgue</div>;
  }

  const catalogue = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
  
  //console.log(catalogue);
  return <CatalogueClient catalogue={catalogue} />;
}
