import { PageMain } from "@/components/page-main";
import { MembershipForm } from "@/features/membership/components/MembershipForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/store/useAuthStore";

export function MembershipPage() {
  useDocumentTitle("Membership");
  const user = useAuthStore((state) => state.user);
  const defaultName = user ? user.email.split("@")[0] : "";

  return (
    <PageMain>
      <h1 className="text-[28px] leading-[1.43] font-bold">Membership</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-body">
        Subscribe a member name. The name is trimmed and matched in lower case, so Annabel and annabel are the same
        subscriber. Use that exact name when you book, or the booking is charged instead of being created already
        paid.
      </p>
      <div className="mt-8">
        <MembershipForm defaultName={defaultName} />
      </div>
    </PageMain>
  );
}
