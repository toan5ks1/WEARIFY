"use server"

import { db } from "@/db"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getCategoryAction(id: number) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
  })
}

export async function getAllCategoryWithSubAction() {
  return await db.query.categories.findMany({
    columns: { title: true },
    with: {
      subcategories: {
        columns: {
          title: true,
        },
      },
    },
  })
}
