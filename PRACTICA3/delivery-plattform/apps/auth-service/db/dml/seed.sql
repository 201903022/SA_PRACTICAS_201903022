insert
	into
	roles (id,
	code,
	description,
	is_system)
values
  ('11111111-1111-1111-1111-111111111111',
'CUSTOMER',
'End user who places orders',
true),
  ('22222222-2222-2222-2222-222222222222',
'MERCHANT',
'Restaurant/store owner or operator',
true),
  ('33333333-3333-3333-3333-333333333333',
'DRIVER',
'Delivery driver',
true),
  ('44444444-4444-4444-4444-444444444444',
'ADMIN',
'Platform administrator',
true);