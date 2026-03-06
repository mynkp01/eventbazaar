import Query from "@api/Query";
import type { Metadata, ResolvingMetadata } from "next";
import { metadata } from "src/app/(client)/layout";
import { customDecodeURIComponent } from "src/utils/helper.server";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}${Query.metaLookup}?keyword=eventType&search=${customDecodeURIComponent(params?.types)}`,
      {
        cache: "no-store",
      },
    );

    const data = await response?.json();

    if (response?.status === 200 || response?.status === 201) {
      return {
        title: data?.data?.metaTitle || metadata?.title,
        description: data?.data?.metaDescription || metadata?.description,
      };
    }
  } catch (e) {
    console.log(`error from meta lookup in ${params?.types}: ${e}`);
  }
}
const TypesLayout = ({ children }) => {
  return children;
};

export default TypesLayout;
