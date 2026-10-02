import { PageMain } from '@/components/page-main'
import { cn } from '@/lib/utils'

function Bone({ className }: { className: string }) {
  return <div className={cn('animate-pulse bg-surface-strong', className)} />
}

export function SpacesSkeleton() {
  return (
    <PageMain>
      <Bone className="h-9 w-80 max-w-full rounded-lg" />
      <Bone className="mt-3 h-5 w-96 max-w-full rounded-lg" />
      <Bone className="mt-8 h-16 rounded-full" />
      <Bone className="mt-4 h-4 w-56 rounded-lg" />
      <div className="mt-16 grid grid-cols-1 gap-x-4 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <Bone className="aspect-square rounded-card" />
            <Bone className="mt-3 h-4 w-2/3 rounded-lg" />
            <Bone className="mt-2 h-3 w-1/2 rounded-lg" />
            <Bone className="mt-2 h-3 w-1/3 rounded-lg" />
          </div>
        ))}
      </div>
    </PageMain>
  )
}

export function SpaceDetailSkeleton() {
  return (
    <PageMain width="detail">
      <div className="grid items-start gap-10 desktop:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <Bone className="aspect-square w-full rounded-card tablet:aspect-4/3" />
          <Bone className="mt-6 h-7 w-56 rounded-lg" />
          <Bone className="mt-3 h-4 w-72 rounded-lg" />
          <Bone className="mt-10 h-6 w-40 rounded-lg" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Bone key={index} className="h-14 rounded-lg" />
            ))}
          </div>
        </div>
        <Bone className="h-96 rounded-card" />
      </div>
    </PageMain>
  )
}

export function HostSkeleton() {
  return (
    <PageMain>
      <Bone className="h-9 w-48 rounded-lg" />
      <Bone className="mt-3 h-5 w-lg max-w-full rounded-lg" />
      <Bone className="mt-10 h-12 rounded-lg" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Bone key={index} className="h-12 rounded-lg" />
        ))}
      </div>
    </PageMain>
  )
}

export function BookingsSkeleton() {
  return (
    <PageMain>
      <Bone className="h-9 w-48 rounded-lg" />
      <Bone className="mt-3 h-4 w-72 rounded-lg" />
      <div className="mt-8 space-y-px">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 py-5"
          >
            <div className="flex-1">
              <Bone className="h-4 w-40 rounded-lg" />
              <Bone className="mt-2 h-3 w-64 max-w-full rounded-lg" />
              <Bone className="mt-2 h-3 w-32 rounded-lg" />
            </div>
            <Bone className="h-4 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </PageMain>
  )
}

export function BookingDetailSkeleton() {
  return (
    <PageMain width="narrow">
      <Bone className="h-80 rounded-card" />
      <Bone className="mt-6 h-4 w-28 rounded-lg" />
    </PageMain>
  )
}

export function MetricsSkeleton() {
  return (
    <PageMain>
      <Bone className="h-9 w-64 rounded-lg" />
      <Bone className="mt-3 h-5 w-xl max-w-full rounded-lg" />
      <div className="mt-10 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Bone key={index} className="h-28 rounded-card" />
        ))}
      </div>
      <Bone className="mt-16 h-6 w-48 rounded-lg" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Bone key={index} className="h-4 rounded-full" />
        ))}
      </div>
    </PageMain>
  )
}
