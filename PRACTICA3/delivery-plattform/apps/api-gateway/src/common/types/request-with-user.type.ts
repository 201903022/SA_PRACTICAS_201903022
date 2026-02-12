export type RequestWithUser = {
  user: { id: string; role: string; email: string; name?: string };
};
