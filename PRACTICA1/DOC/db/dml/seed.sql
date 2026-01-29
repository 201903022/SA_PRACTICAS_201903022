insert
	into
	auth.roles (id,
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

insert
	into
	auth.users (id,
	email,
	password,
	name,
	phone_number,
	role_id,
	is_active,
	email_verified)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'ana.customer@example.com',
'$2b$10$hash_example_customer',
'Ana Customer',
'+50255550001',
'11111111-1111-1111-1111-111111111111',
true,
true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'mario.merchant@example.com',
'$2b$10$hash_example_merchant',
'Mario Merchant',
'+50255550002',
'22222222-2222-2222-2222-222222222222',
true,
true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc',
'dani.driver@example.com',
'$2b$10$hash_example_driver',
'Dani Driver',
'+50255550003',
'33333333-3333-3333-3333-333333333333',
true,
true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd',
'admin@example.com',
'$2b$10$hash_example_admin',
'Admin User',
'+50255550004',
'44444444-4444-4444-4444-444444444444',
true,
true);
-- Auth code de ejemplo (PASSWORD_RESET) para Ana
insert
	into
	auth.auth_codes (
  id,
	user_id,
	code_hash,
	type,
	attempts,
	max_attempts,
	expires_at,
	used_at,
	destination
)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'sha256:hash_of_code_123456',
   'PASSWORD_RESET',
   0,
   5,
   now() + interval '15 minutes',
   null,
   'ana.customer@example.com'
  );
-- =========================
-- CATALOG
-- =========================

insert
	into
	catalog.merchant_types (id,
	code,
	name,
	description)
values
  ('55555555-5555-5555-5555-555555555555',
'RESTAURANT',
'Restaurant',
'Food service merchant'),
  ('66666666-6666-6666-6666-666666666666',
'SUPERMARKET',
'Supermarket',
'Grocery merchant');

insert
	into
	catalog.restaurants (
  id,
	name,
	address,
	phone,
	alias,
	opening_hours,
	is_active,
	merchant_type_id
)
values
  ('99999999-9999-9999-9999-999999999999',
   'Taco Palace',
   'Zone 10, Guatemala City',
   '+502 5555-1000',
   'taco-palace',
   'Mon-Sun 10:00-22:00',
   true,
   '55555555-5555-5555-5555-555555555555'
  ),
  ('88888888-8888-8888-8888-888888888888',
   'Fresh Market',
   'Zone 15, Guatemala City',
   '+502 5555-2000',
   'fresh-market',
   'Mon-Sun 07:00-21:00',
   true,
   '66666666-6666-6666-6666-666666666666'
  );
-- Categorías globales de restaurantes
insert
	into
	catalog.restaurant_categories (id,
	name,
	description,
	is_active)
values
  ('77777777-7777-7777-7777-777777777777',
'Fast Food',
'Quick meals and combos',
true),
  ('12121212-1212-1212-1212-121212121212',
'Groceries',
'Grocery and daily supplies',
true),
  ('13131313-1313-1313-1313-131313131313',
'Mexican',
'Mexican cuisine',
true);
-- Mapeo restaurante -> categorías
insert
	into
	catalog.restaurant_category_map (restaurant_id,
	category_id)
values
  ('99999999-9999-9999-9999-999999999999',
'77777777-7777-7777-7777-777777777777'),
-- Taco Palace -> Fast Food
  ('99999999-9999-9999-9999-999999999999',
'13131313-1313-1313-1313-131313131313'),
-- Taco Palace -> Mexican
  ('88888888-8888-8888-8888-888888888888',
'12121212-1212-1212-1212-121212121212');
-- Fresh Market -> Groceries
-- Categorías de menú (por restaurante)
insert
	into
	catalog.menu_item_categories (id,
	restaurant_id,
	name,
	description,
	is_active)
values
  ('14141414-1414-1414-1414-141414141414',
'99999999-9999-9999-9999-999999999999',
'Tacos',
'Taco options',
true),
  ('15151515-1515-1515-1515-151515151515',
'99999999-9999-9999-9999-999999999999',
'Drinks',
'Beverages',
true),
  ('16161616-1616-1616-1616-161616161616',
'88888888-8888-8888-8888-888888888888',
'Fruits',
'Fresh fruits',
true),
  ('17171717-1717-1717-1717-171717171717',
'88888888-8888-8888-8888-888888888888',
'Snacks',
'Chips and snacks',
true);
-- Items de menú/productos
insert
	into
	catalog.menu_items (
  id,
	restaurant_id,
	name,
	description,
	price,
	currency,
	is_available
)
values
  ('18181818-1818-1818-1818-181818181818',
'99999999-9999-9999-9999-999999999999',
   'Beef Taco',
'Taco with beef and salsa',
18.50,
'GTQ',
true),
  ('19191919-1919-1919-1919-191919191919',
'99999999-9999-9999-9999-999999999999',
   'Horchata',
'Traditional drink',
12.00,
'GTQ',
true),
  ('20202020-2020-2020-2020-202020202020',
'88888888-8888-8888-8888-888888888888',
   'Bananas (1 lb)',
'Fresh bananas',
7.25,
'GTQ',
true),
  ('21212121-2121-2121-2121-212121212121',
'88888888-8888-8888-8888-888888888888',
   'Potato Chips',
'Classic salted chips',
9.50,
'GTQ',
true);
-- Mapeo item -> categoría de menú
insert
	into
	catalog.menu_item_category_map (menu_item_id,
	category_id)
values
  ('18181818-1818-1818-1818-181818181818',
'14141414-1414-1414-1414-141414141414'),
-- Beef Taco -> Tacos
  ('19191919-1919-1919-1919-191919191919',
'15151515-1515-1515-1515-151515151515'),
-- Horchata -> Drinks
  ('20202020-2020-2020-2020-202020202020',
'16161616-1616-1616-1616-161616161616'),
-- Bananas -> Fruits
  ('21212121-2121-2121-2121-212121212121',
'17171717-1717-1717-1717-171717171717');
-- Chips -> Snacks
-- =========================
-- ORDERS
-- =========================
-- Orden creada por Ana en Taco Palace
insert
	into
	orders.orders (
  id,
	customer_user_id,
	restaurant_id,
	status,
	restaurant_name_snapshot,
	delivery_address,
	total_amount,
	currency,
	canceled_at,
	canceled_by_user_id,
	rejection_reason
)
values
  ('30303030-3030-3030-3030-303030303030',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '99999999-9999-9999-9999-999999999999',
   'CREATED',
   'Taco Palace',
   'Apt 12B, Zone 10, Guatemala City',
   49.00,
   'GTQ',
   null,
   null,
   null
  );
-- Items de la orden (IMPORTANT: line_total = unit_price * quantity)
insert
	into
	orders.order_items (
  id,
	order_id,
	menu_item_id,
	item_name_snapshot,
	unit_price,
	quantity,
	line_total
)
values
  ('31313131-3131-3131-3131-313131313131',
   '30303030-3030-3030-3030-303030303030',
   '18181818-1818-1818-1818-181818181818',
   'Beef Taco',
   18.50,
   2,
   37.00
  ),
  ('32323232-3232-3232-3232-323232323232',
   '30303030-3030-3030-3030-303030303030',
   '19191919-1919-1919-1919-191919191919',
   'Horchata',
   12.00,
   1,
   12.00
  );
-- (Opcional) Cambiar estado de la orden a IN_PROGRESS (si tu app lo hace)
update
	orders.orders
set
	status = 'IN_PROGRESS'
where
	id = '30303030-3030-3030-3030-303030303030';
-- =========================
-- DELIVERY
-- =========================
-- Entrega asignada al driver Dani para esa orden
insert
	into
	delivery.deliveries (
  id,
	order_id,
	driver_user_id,
	status,
	accepted_at,
	picked_up_at,
	delivered_at,
	canceled_at,
	cancel_reason
)
values
  ('40404040-4040-4040-4040-404040404040',
   '30303030-3030-3030-3030-303030303030',
   'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'READY',
   now(),
   null,
   null,
   null,
   null
  );

insert
	into
	delivery.delivery_events (id,
	delivery_id,
	event,
	note)
values
  ('41414141-4141-4141-4141-414141414141',
'40404040-4040-4040-4040-404040404040',
'ACCEPTED',
'Driver accepted the delivery'),
  ('42424242-4242-4242-4242-424242424242',
'40404040-4040-4040-4040-404040404040',
'ON_THE_WAY',
'Driver is on the way to customer');
-- =========================
-- NOTIFICATIONS (OUTBOX)
-- =========================
-- Notificación pendiente de creación de orden
insert
	into
	notifications.notification_outbox (
  id,
	type,
	status,
	to_email,
	order_id,
	customer_user_id,
	attempts,
	last_error,
	scheduled_at,
	sent_at
)
values
  ('50505050-5050-5050-5050-505050505050',
   'ORDER_CREATED',
   'PENDING',
   'ana.customer@example.com',
   '30303030-3030-3030-3030-303030303030',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   0,
   null,
   now(),
   null
  );

update
	notifications.notification_outbox
set
	status = 'SENT',
	sent_at = now()
where
	id = '50505050-5050-5050-5050-505050505050';