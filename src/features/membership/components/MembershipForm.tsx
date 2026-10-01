import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getApiError } from "@/api/errors";
import { useSubscribeMutation } from "@/features/membership/api/useSubscribeMutation";
import { formatWhen } from "@/lib/format";
import { errorClass, inputClass, labelClass, primaryButtonClass } from "@/lib/styles";

const membershipSchema = z.object({
  name: z.string().trim().min(1, "member name must not be blank"),
});

type MembershipValues = z.infer<typeof membershipSchema>;

export function MembershipForm({ defaultName }: { defaultName: string }) {
  const subscribe = useSubscribeMutation();
  const form = useForm<MembershipValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: { name: defaultName },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => subscribe.mutate(values.name))}
      className="max-w-md space-y-4"
      noValidate
    >
      <label className="block">
        <span className={labelClass}>Member name</span>
        <input className={inputClass} {...form.register("name")} />
        {form.formState.errors.name && (
          <p className={`mt-1.5 ${errorClass}`} role="alert">
            {form.formState.errors.name.message}
          </p>
        )}
      </label>
      {subscribe.isError && (
        <p className={errorClass} role="alert">
          {getApiError(subscribe.error, "Could not subscribe")}
        </p>
      )}
      {subscribe.data && (
        <p className="text-sm text-ink">
          {subscribe.data.member} is subscribed since {formatWhen(subscribe.data.started_at)}.
        </p>
      )}
      <button type="submit" disabled={subscribe.isPending} className={primaryButtonClass}>
        {subscribe.isPending ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
