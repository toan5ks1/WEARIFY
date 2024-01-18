import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { eq } from "drizzle-orm"

import { getCacheduser } from "@/lib/fetchers/auth"
import { getSubscriptionPlan } from "@/lib/fetchers/stripe"
import { getDashboardRedirectPath } from "@/lib/subscription"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { StoreSwitcher } from "@/components/pagers/store-switcher"
import { StoreTabs } from "@/components/pagers/store-tabs"
import { Shell } from "@/components/shells/shell"

interface StoreLayoutProps extends React.PropsWithChildren {
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const storeId = Number(params.storeId)

  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  const allStores = await db
    .select({
      id: stores.id,
      name: stores.name,
    })
    .from(stores)
    .where(eq(stores.userId, user.id))

  const store = allStores.find((store) => store.id === storeId)

  if (!store) {
    notFound()
  }

  const subscriptionPlan = await getSubscriptionPlan({ userId: user.id })

  return (
    <Shell variant="sidebar">
      <div className="flex flex-col gap-4 pr-1 xxs:flex-row">
        <PageHeader className="flex-1">
          <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Manage your store
          </PageHeaderDescription>
        </PageHeader>
        {allStores.length > 1 ? (
          <StoreSwitcher
            currentStore={store}
            stores={allStores}
            dashboardRedirectPath={getDashboardRedirectPath({
              subscriptionPlan,
              storeCount: allStores.length,
            })}
          />
        ) : null}
      </div>
      <StoreTabs storeId={storeId} />
      <div className="overflow-hidden">{children}</div>
    </Shell>
  )
}
