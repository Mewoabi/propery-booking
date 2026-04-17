export type CreateUserDto = {
  name: string;
  email: string;
  phone_number: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type CreatePropertyDto = {
  title: string;
  location: string;
  price_per_night: number;
  availability: string;
};

export type UpdatePropertyDto = Partial<CreatePropertyDto>;

export type CreateBookingDto = {
  user_id: number;
  property_id: number;
  start_date: Date | string;
  end_date: Date | string;
};

export type UpdateBookingDto = Partial<CreateBookingDto>;
