import { HostSkeleton } from "@/components/loading-state";
import { PageMain } from "@/components/page-main";
import { CreateSpaceForm, SpaceEditor } from "@/features/host/components/HostForms";
import { useSpacesQuery } from "@/features/spaces/api/useSpacesQuery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function HostPage() {
  useDocumentTitle("Host");
  const spacesQuery = useSpacesQuery();

  if (spacesQuery.isPending) return <HostSkeleton />;

  const spaces = spacesQuery.data ?? [];

  return (
    <PageMain>
      <h1 className="text-[28px] leading-[1.43] font-bold">Your spaces</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-body">
        Add a room, change its price, or remove it. A space that still has bookings cannot be deleted until those
        bookings are cancelled.
      </p>
      <div className="mt-10">
        <div className="mb-1 hidden gap-3 px-3 text-xs font-medium text-muted tablet:grid tablet:grid-cols-[minmax(0,1fr)_7rem_8rem_6.5rem]">
          <span>Name</span>
          <span>Capacity</span>
          <span>USD / hour</span>
        </div>
        <div className="divide-y divide-hairline-soft">
          <div className="py-3">
            <CreateSpaceForm key={spaces.length} />
          </div>
          {spaces.map((space) => (
            <div key={space.id} className="py-3">
              <SpaceEditor space={space} />
            </div>
          ))}
        </div>
      </div>
    </PageMain>
  );
}
