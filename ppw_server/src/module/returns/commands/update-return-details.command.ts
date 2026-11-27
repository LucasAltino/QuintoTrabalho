export type UpdateReturnDetailsInput = {
  reason?: string;
  description?: string;
  trackingCode?: string | null;
};

export type UpdateReturnDetailsCommand = {
  id: string;
  input: UpdateReturnDetailsInput;
};
