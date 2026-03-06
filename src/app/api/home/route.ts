import { revalidatePath } from "next/cache";
import { ROUTES } from "src/utils/Constant";

export async function POST() {
  try {
    revalidatePath(ROUTES.home);
  } catch (err) {
    console.log(err?.message);
  }
  return Response.json({
    revalidated: true,
    message: "Home revalidated",
  });
}
