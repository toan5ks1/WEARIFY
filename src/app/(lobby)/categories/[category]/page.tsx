import type { Metadata } from "next"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"

import { getCategoryWithSubAction } from "@/lib/fetchers/category"
import { getProducts } from "@/lib/fetchers/product"
import { getStores } from "@/lib/fetchers/store"
import { toTitleCase } from "@/lib/utils"
import { productsSearchParamsSchema } from "@/lib/validations/params"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Products } from "@/components/products"
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

  // Stores transaction
  const categoryWithSub = await getCategoryWithSubAction(category)
  console.log(categoryWithSub)

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      {/* <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        category={category}
        stores={storesTransaction.items}
        storePageCount={storePageCount}
      /> */}
    </Shell>
  )
}
