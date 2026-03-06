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
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}${Query.metaLookup}?keyword=category&search=${customDecodeURIComponent(params?.types_category)}`,
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
    console.log(`error from meta lookup in ${params?.types_category}: ${e}`);
  }
}

const TypesCategoryLayout = ({ children }) => {
  return children;
};

export default TypesCategoryLayout;
