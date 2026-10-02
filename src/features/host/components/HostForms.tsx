import { zodResolver } from '@hookform/resolvers/zod'
import { Check, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getApiError } from '@/api/errors'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  useCreateSpaceMutation,
  useDeleteSpaceMutation,
  useUpdateSpaceMutation,
} from '@/features/host/api/useSpaceMutations'
import { dollarsToCents } from '@/lib/format'
import { errorClass } from '@/lib/styles'
import { cn } from '@/lib/utils'
import type { Space } from '@/types/api'

const fieldClass =
  'h-12 w-full rounded-lg border border-hairline bg-canvas px-3 text-sm text-ink outline-none placeholder:text-muted-soft focus:border-2 focus:border-ink'

const iconButtonClass =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed'

const priceField = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d+(\.\d{1,2})?$/.test(value), {
    message: 'price_cents must be a non-negative integer',
  })

const createSchema = z.object({
  name: z.string().trim().min(1, 'name must not be empty'),
  capacity: z
    .string()
    .regex(/^[1-9]\d*$/, 'capacity must be a whole number of at least 1'),
  price: priceField,
})

const updateSchema = z.object({
  name: z.string().trim().min(1, 'name must not be empty'),
  capacity: z
    .string()
    .regex(/^[1-9]\d*$/, 'capacity must be a whole number of at least 1'),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, 'price_cents must be a non-negative integer'),
})

type CreateValues = z.infer<typeof createSchema>
type UpdateValues = z.infer<typeof updateSchema>

export function CreateSpaceForm() {
  const createSpace = useCreateSpaceMutation()
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', capacity: '', price: '' },
  })

  function onSubmit(values: CreateValues) {
    const priceRaw = values.price.trim()
    let priceCents: number | undefined
    if (priceRaw !== '') {
      const cents = dollarsToCents(priceRaw)
      if (cents == null) return
      priceCents = cents
    }
    createSpace.mutate(
      {
        name: values.name,
        capacity: Number(values.capacity),
        price_cents: priceCents,
      },
      {
        onSuccess: () => form.reset(),
      },
    )
  }

  const message =
    form.formState.errors.name?.message ||
    form.formState.errors.capacity?.message ||
    form.formState.errors.price?.message

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_7rem_8rem_auto] tablet:items-center">
        <input
          aria-label="Name"
          placeholder="Name"
          className={fieldClass}
          {...form.register('name')}
        />
        <input
          aria-label="Capacity"
          type="number"
          min={1}
          placeholder="Capacity"
          className={fieldClass}
          {...form.register('capacity')}
        />
        <input
          aria-label="USD per hour"
          inputMode="decimal"
          placeholder="USD / hour"
          className={fieldClass}
          {...form.register('price')}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createSpace.isPending}
            aria-label="Add space"
            className={cn(
              iconButtonClass,
              'bg-ink text-on-primary hover:bg-black disabled:bg-hairline-soft disabled:text-muted-soft',
            )}
          >
            {createSpace.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
          </button>
          <span className="hidden h-12 w-12 tablet:block" aria-hidden />
        </div>
      </div>
      {message && (
        <p className={`mt-2 ${errorClass}`} role="alert">
          {message}
        </p>
      )}
      {createSpace.isError && (
        <p className={`mt-2 ${errorClass}`} role="alert">
          {getApiError(createSpace.error, 'Could not add the space')}
        </p>
      )}
    </form>
  )
}

export function SpaceEditor({ space }: { space: Space }) {
  const updateSpace = useUpdateSpaceMutation(space.id)
  const deleteSpace = useDeleteSpaceMutation(space.id)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const form = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: space.name,
      capacity: String(space.capacity),
      price: (space.price_cents / 100).toFixed(2),
    },
  })

  function onSubmit(values: UpdateValues) {
    const cents = dollarsToCents(values.price.trim())
    if (cents == null) return
    updateSpace.mutate({
      name: values.name,
      capacity: Number(values.capacity),
      price_cents: cents,
    })
  }

  const message =
    form.formState.errors.name?.message ||
    form.formState.errors.capacity?.message ||
    form.formState.errors.price?.message

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_7rem_8rem_auto] tablet:items-center">
        <input
          aria-label="Name"
          className={fieldClass}
          {...form.register('name')}
        />
        <input
          aria-label="Capacity"
          type="number"
          min={1}
          className={fieldClass}
          {...form.register('capacity')}
        />
        <input
          aria-label="USD per hour"
          className={fieldClass}
          {...form.register('price')}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updateSpace.isPending}
            aria-label={`Save ${space.name}`}
            className={cn(
              iconButtonClass,
              'bg-ink text-on-primary hover:bg-black disabled:bg-hairline-soft disabled:text-muted-soft',
            )}
          >
            {updateSpace.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </button>
          <button
            type="button"
            disabled={deleteSpace.isPending}
            aria-label={`Delete ${space.name}`}
            className={cn(
              iconButtonClass,
              'text-ink hover:bg-surface-soft disabled:text-muted-soft',
            )}
            onClick={() => setConfirmingDelete(true)}
          >
            {deleteSpace.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>
      </div>
      {message && (
        <p className={`mt-2 ${errorClass}`} role="alert">
          {message}
        </p>
      )}
      {updateSpace.isError && (
        <p className={`mt-2 ${errorClass}`} role="alert">
          {getApiError(updateSpace.error, 'Could not save the space')}
        </p>
      )}
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this space?"
        description={`${space.name} will be removed. This cannot be undone. A space that still has bookings cannot be deleted until those bookings are cancelled.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        pending={deleteSpace.isPending}
        error={
          deleteSpace.isError ? getApiError(deleteSpace.error, 'Could not delete the space') : undefined
        }
        onClose={() => {
          if (deleteSpace.isPending) return
          setConfirmingDelete(false)
        }}
        onConfirm={() => deleteSpace.mutate()}
      />
    </form>
  )
}
