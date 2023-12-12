"use server"

import { db } from "@/db"
import { subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getSubcategoryAction(id: number) {
  return await db.query.subcategories.findFirst({
    where: eq(subcategories.id, id),
    with: {
      sides: true,
    },
  })
}
