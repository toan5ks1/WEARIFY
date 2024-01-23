import type { Metadata } from "next"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { eq } from "drizzle-orm"

import { toTitleCase } from "@/lib/utils"
import { SubcategoryCard } from "@/components/cards/subcategory-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: SearchParams
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params

  const categoryWithSub = await db.query.categories.findFirst({
    where: eq(categories.slug, category),
    with: {
      subcategories: true,
    },
  })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">
          {categoryWithSub?.title ?? category}
        </PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {categoryWithSub?.subcategories.map((subcategory) => (
          <SubcategoryCard
            key={subcategory.slug}
            category={category}
            subcategory={subcategory}
          />
        ))}
      </section>
    </Shell>
  )
}
