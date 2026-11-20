import { ProductEditor } from "@/components/product-editor";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const blank = {
  id: "",
  slug: "",
  name: "",
  code: "",
  summary: "",
  introduction: "",
  audience: "",
  onlineEnabled: true,
  offlineEnabled: true,
  onlineSummary: "A hosted web application, opened in a browser.",
  offlineSummary: "The same web application, installed on a server inside the organisation.",
  onlineDetail: "Staff reach it over the internet. Byzantine Unravel hosts the server, or the organisation hosts it in its own cloud account.",
  offlineDetail: "The server sits on the local network. The work continues when the public internet does not.",
  imageUrl: "",
  sortOrder: 10,
  published: false,
  seoTitle: "",
  seoDescription: "",
  features: [{ title: "", body: "" }],
};

export default async function NewProductPage() {
  await requireDeskUser();
  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">New product</h1>
      <ProductEditor product={blank} />
    </>
  );
}
