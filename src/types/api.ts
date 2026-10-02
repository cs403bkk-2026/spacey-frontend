export type ApiError = {
  error: string;
};

export type Space = {
  id: number;
  name: string;
  capacity: number;
  price_cents: number;
  available: boolean;
};

export type Booking = {
  id: number;
  space_id: number;
  member: string;
  paid: boolean;
  start_time: string;
  end_time: string;
  amount_cents: number;
  user_id: number | null;
  card_last4: string | null;
  created_at: string;
};

export type User = {
  id: number;
  email: string;
};

export type Subscription = {
  member: string;
  active: boolean;
  started_at: string;
};

export type UnlockResult = {
  booking_id: number;
  access_code: string;
};

export type RevenueBySpace = {
  id: number;
  name: string;
  revenue_cents: number;
};

export type Metrics = {
  spaces: number;
  bookings: number;
  paid_bookings: number;
  unpaid_bookings: number;
  members: number;
  revenue_cents: number;
  utilization: number;
  repeat_member_rate: number;
  payment_conversion: number;
  avg_revenue_cents_per_paid_booking: number;
  revenue_by_space: RevenueBySpace[];
};

export type Health = {
  status: "ok";
  revision: string;
};

export type SpaceList = {
  spaces: Space[];
};

export type BookingList = {
  bookings: Booking[];
};

export type CreateSpaceInput = {
  name: string;
  capacity: number;
  price_cents?: number;
};

export type UpdateSpaceInput = {
  name?: string;
  capacity?: number;
  price_cents?: number;
};

export type CreateBookingInput = {
  member?: string;
  start_time: string;
  end_time: string;
  party_size?: number;
};

export type PayBookingInput = {
  card_number: string;
  expiry: string;
  cvc: string;
};
