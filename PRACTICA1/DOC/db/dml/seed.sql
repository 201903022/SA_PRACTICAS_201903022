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
-- CATALOG

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
-- ORDERS
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
-- DELIVERY
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
-- NOTIFICATIONS (OUTBOX)
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


-- AUTH: más roles opcionales? (NO, ya tienes los 4)

-- AUTH: más users
insert into auth.users (
  id, email, password, name, phone_number, role_id, is_active, email_verified
) values
  -- Customers
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'luis.customer@example.com',  '$2b$10$hash_example_customer2', 'Luis Customer',  '+50255550005', '11111111-1111-1111-1111-111111111111', true, true),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'sofia.customer@example.com', '$2b$10$hash_example_customer3', 'Sofia Customer', '+50255550006', '11111111-1111-1111-1111-111111111111', true, true),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'carlos.customer@example.com','$2b$10$hash_example_customer4', 'Carlos Customer','+50255550007', '11111111-1111-1111-1111-111111111111', true, false),

  -- Merchants
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'laura.merchant@example.com', '$2b$10$hash_example_merchant2', 'Laura Merchant', '+50255550008', '22222222-2222-2222-2222-222222222222', true, true),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'kevin.merchant@example.com', '$2b$10$hash_example_merchant3', 'Kevin Merchant', '+50255550009', '22222222-2222-2222-2222-222222222222', true, true),

  -- Drivers
  ('ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'paola.driver@example.com', '$2b$10$hash_example_driver2', 'Paola Driver', '+50255550010', '33333333-3333-3333-3333-333333333333', true, true),
  ('ccccccc2-cccc-cccc-cccc-ccccccccccc2', 'diego.driver@example.com', '$2b$10$hash_example_driver3', 'Diego Driver', '+50255550011', '33333333-3333-3333-3333-333333333333', true, true),
  ('ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'maria.driver@example.com', '$2b$10$hash_example_driver4', 'Maria Driver', '+50255550012', '33333333-3333-3333-3333-333333333333', true, false);

-- Auth codes extra (ejemplos)
insert into auth.auth_codes (
  id, user_id, code_hash, type, attempts, max_attempts, expires_at, used_at, destination
) values
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'sha256:hash_of_code_654321', 'EMAIL_VERIFICATION', 0, 5, now() + interval '30 minutes', null, 'carlos.customer@example.com'),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2', 'ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'sha256:hash_of_code_111222', 'LOGIN_OTP',          0, 5, now() + interval '10 minutes', null, 'maria.driver@example.com');

-- CATALOG: más merchant_types (opcional)
insert into catalog.merchant_types (id, code, name, description) values
  ('67676767-6767-6767-6767-676767676767', 'PHARMACY', 'Pharmacy', 'Medicine and personal care')
on conflict (code) do nothing;

-- CATALOG: más restaurantes
insert into catalog.restaurants (
  id, name, address, phone, alias, opening_hours, is_active, merchant_type_id
) values
  ('aaaa9999-0000-0000-0000-000000000001', 'Burger House',   'Zone 4, Guatemala City',  '+502 5555-3000', 'burger-house',   'Mon-Sun 11:00-23:00', true, '55555555-5555-5555-5555-555555555555'), -- restaurant
  ('aaaa9999-0000-0000-0000-000000000002', 'Green Bowl',     'Zone 13, Guatemala City', '+502 5555-4000', 'green-bowl',     'Mon-Fri 09:00-21:00', true, '55555555-5555-5555-5555-555555555555'), -- restaurant
  ('aaaa9999-0000-0000-0000-000000000003', 'City Pharmacy',  'Zone 1, Guatemala City',  '+502 5555-5000', 'city-pharmacy',  'Mon-Sun 08:00-20:00', true, '67676767-6767-6767-6767-676767676767'); -- pharmacy

-- CATALOG: más restaurant_categories (globales)
insert into catalog.restaurant_categories (id, name, description, is_active) values
  ('22222220-2222-2222-2222-222222222220', 'Burgers',   'Burgers and fries', true),
  ('22222221-2222-2222-2222-222222222221', 'Healthy',   'Salads and healthy bowls', true),
  ('22222222-2222-2222-2222-222222222222', 'Pharmacy',  'Medicines and essentials', true)
on conflict (name) do nothing;

-- Mapeo restaurante -> categorías
insert into catalog.restaurant_category_map (restaurant_id, category_id) values
  ('aaaa9999-0000-0000-0000-000000000001', '22222220-2222-2222-2222-222222222220'), -- Burger House -> Burgers
  ('aaaa9999-0000-0000-0000-000000000002', '22222221-2222-2222-2222-222222222221'), -- Green Bowl -> Healthy
  ('aaaa9999-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222'); -- City Pharmacy -> Pharmacy

-- CATALOG: menu_item_categories (por restaurante)
insert into catalog.menu_item_categories (
  id, restaurant_id, name, description, is_active
) values
  -- Burger House
  ('33333330-3333-3333-3333-333333333330', 'aaaa9999-0000-0000-0000-000000000001', 'Burgers', 'Burgers menu', true),
  ('33333331-3333-3333-3333-333333333331', 'aaaa9999-0000-0000-0000-000000000001', 'Sides',   'Fries and sides', true),

  -- Green Bowl
  ('33333332-3333-3333-3333-333333333332', 'aaaa9999-0000-0000-0000-000000000002', 'Bowls',   'Signature bowls', true),
  ('33333333-3333-3333-3333-333333333333', 'aaaa9999-0000-0000-0000-000000000002', 'Drinks',  'Beverages', true),

  -- City Pharmacy
  ('33333334-3333-3333-3333-333333333334', 'aaaa9999-0000-0000-0000-000000000003', 'Medicines','OTC medicines', true),
  ('33333335-3333-3333-3333-333333333335', 'aaaa9999-0000-0000-0000-000000000003', 'Personal Care','Hygiene and care', true);

-- CATALOG: menu_items (productos)
insert into catalog.menu_items (
  id, restaurant_id, name, description, price, currency, is_available
) values
  -- Burger House
  ('44444440-4444-4444-4444-444444444440', 'aaaa9999-0000-0000-0000-000000000001', 'Classic Burger', 'Beef burger with cheese', 35.00, 'GTQ', true),
  ('44444441-4444-4444-4444-444444444441', 'aaaa9999-0000-0000-0000-000000000001', 'Fries',          'Crispy fries',              12.50, 'GTQ', true),

  -- Green Bowl
  ('44444442-4444-4444-4444-444444444442', 'aaaa9999-0000-0000-0000-000000000002', 'Chicken Bowl',   'Chicken + veggies + rice', 42.00, 'GTQ', true),
  ('44444443-4444-4444-4444-444444444443', 'aaaa9999-0000-0000-0000-000000000002', 'Lemonade',       'Fresh lemonade',            10.00, 'GTQ', true),

  -- City Pharmacy
  ('44444444-4444-4444-4444-444444444444', 'aaaa9999-0000-0000-0000-000000000003', 'Paracetamol 500mg', 'Pain relief tablets',      18.00, 'GTQ', true),
  ('44444445-4444-4444-4444-444444444445', 'aaaa9999-0000-0000-0000-000000000003', 'Hand Sanitizer',    'Alcohol gel 250ml',        22.75, 'GTQ', true);

-- Mapeo item -> categoría de menú
insert into catalog.menu_item_category_map (menu_item_id, category_id) values
  ('44444440-4444-4444-4444-444444444440', '33333330-3333-3333-3333-333333333330'), -- Classic Burger -> Burgers
  ('44444441-4444-4444-4444-444444444441', '33333331-3333-3333-3333-333333333331'), -- Fries -> Sides
  ('44444442-4444-4444-4444-444444444442', '33333332-3333-3333-3333-333333333332'), -- Chicken Bowl -> Bowls
  ('44444443-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333'), -- Lemonade -> Drinks
  ('44444444-4444-4444-4444-444444444444', '33333334-3333-3333-3333-333333333334'), -- Paracetamol -> Medicines
  ('44444445-4444-4444-4444-444444444445', '33333335-3333-3333-3333-333333333335'); -- Sanitizer -> Personal Care

-- ORDERS: más órdenes + items (totales coherentes)

-- Orden #2: Sofia compra en Burger House (Classic Burger x1, Fries x2) => 35.00 + 25.00 = 60.00
insert into orders.orders (
  id, customer_user_id, restaurant_id, status,
  restaurant_name_snapshot, delivery_address,
  total_amount, currency,
  canceled_at, canceled_by_user_id, rejection_reason
) values
  ('30303030-3030-3030-3030-303030303031',
   'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
   'aaaa9999-0000-0000-0000-000000000001',
   'CREATED',
   'Burger House',
   'House 3, Zone 4, Guatemala City',
   60.00,
   'GTQ',
   null, null, null
  );

insert into orders.order_items (
  id, order_id, menu_item_id,
  item_name_snapshot, unit_price, quantity, line_total
) values
  ('31313131-3131-3131-3131-313131313141',
   '30303030-3030-3030-3030-303030303031',
   '44444440-4444-4444-4444-444444444440',
   'Classic Burger', 35.00, 1, 35.00),
  ('31313131-3131-3131-3131-313131313142',
   '30303030-3030-3030-3030-303030303031',
   '44444441-4444-4444-4444-444444444441',
   'Fries', 12.50, 2, 25.00);

-- Orden #3: Luis compra en Green Bowl (Chicken Bowl x1, Lemonade x1) => 42 + 10 = 52
insert into orders.orders (
  id, customer_user_id, restaurant_id, status,
  restaurant_name_snapshot, delivery_address,
  total_amount, currency,
  canceled_at, canceled_by_user_id, rejection_reason
) values
  ('30303030-3030-3030-3030-303030303032',
   'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
   'aaaa9999-0000-0000-0000-000000000002',
   'IN_PROGRESS',
   'Green Bowl',
   'Apt 9, Zone 13, Guatemala City',
   52.00,
   'GTQ',
   null, null, null
  );

insert into orders.order_items (
  id, order_id, menu_item_id,
  item_name_snapshot, unit_price, quantity, line_total
) values
  ('31313131-3131-3131-3131-313131313151',
   '30303030-3030-3030-3030-303030303032',
   '44444442-4444-4444-4444-444444444442',
   'Chicken Bowl', 42.00, 1, 42.00),
  ('31313131-3131-3131-3131-313131313152',
   '30303030-3030-3030-3030-303030303032',
   '44444443-4444-4444-4444-444444444443',
   'Lemonade', 10.00, 1, 10.00);

-- Orden #4: Carlos compra en City Pharmacy (Paracetamol x2, Sanitizer x1) => 36 + 22.75 = 58.75
insert into orders.orders (
  id, customer_user_id, restaurant_id, status,
  restaurant_name_snapshot, delivery_address,
  total_amount, currency,
  canceled_at, canceled_by_user_id, rejection_reason
) values
  ('30303030-3030-3030-3030-303030303033',
   'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
   'aaaa9999-0000-0000-0000-000000000003',
   'READY',
   'City Pharmacy',
   'Office 2, Zone 1, Guatemala City',
   58.75,
   'GTQ',
   null, null, null
  );

insert into orders.order_items (
  id, order_id, menu_item_id,
  item_name_snapshot, unit_price, quantity, line_total
) values
  ('31313131-3131-3131-3131-313131313161',
   '30303030-3030-3030-3030-303030303033',
   '44444444-4444-4444-4444-444444444444',
   'Paracetamol 500mg', 18.00, 2, 36.00),
  ('31313131-3131-3131-3131-313131313162',
   '30303030-3030-3030-3030-303030303033',
   '44444445-4444-4444-4444-444444444445',
   'Hand Sanitizer', 22.75, 1, 22.75);

-- Orden #5: Ana orden cancelada (para probar CANCELED)
-- Beef Taco x1 (18.50) + Horchata x1 (12.00) => 30.50
insert into orders.orders (
  id, customer_user_id, restaurant_id, status,
  restaurant_name_snapshot, delivery_address,
  total_amount, currency,
  canceled_at, canceled_by_user_id, rejection_reason
) values
  ('30303030-3030-3030-3030-303030303034',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '99999999-9999-9999-9999-999999999999',
   'CANCELED',
   'Taco Palace',
   'Apt 12B, Zone 10, Guatemala City',
   30.50,
   'GTQ',
   now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null
  );

insert into orders.order_items (
  id, order_id, menu_item_id,
  item_name_snapshot, unit_price, quantity, line_total
) values
  ('31313131-3131-3131-3131-313131313171',
   '30303030-3030-3030-3030-303030303034',
   '18181818-1818-1818-1818-181818181818',
   'Beef Taco', 18.50, 1, 18.50),
  ('31313131-3131-3131-3131-313131313172',
   '30303030-3030-3030-3030-303030303034',
   '19191919-1919-1919-1919-191919191919',
   'Horchata', 12.00, 1, 12.00);

-- DELIVERY: deliveries + events para nuevas órdenes

-- Delivery para orden #2 (Sofia): asignada a Paola, en camino
insert into delivery.deliveries (
  id, order_id, driver_user_id, status,
  accepted_at, picked_up_at, delivered_at, canceled_at, cancel_reason
) values
  ('40404040-4040-4040-4040-404040404041',
   '30303030-3030-3030-3030-303030303031',
   'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
   'ON_THE_WAY',
   now() - interval '12 minutes',
   now() - interval '6 minutes',
   null,
   null,
   null
  );

insert into delivery.delivery_events (id, delivery_id, event, note) values
  ('41414141-4141-4141-4141-414141414161', '40404040-4040-4040-4040-404040404041', 'ACCEPTED',  'Driver accepted the delivery'),
  ('41414141-4141-4141-4141-414141414162', '40404040-4040-4040-4040-404040404041', 'ON_THE_WAY', 'Driver left the restaurant');

-- Delivery para orden #3 (Luis): asignada a Diego, entregada
insert into delivery.deliveries (
  id, order_id, driver_user_id, status,
  accepted_at, picked_up_at, delivered_at, canceled_at, cancel_reason
) values
  ('40404040-4040-4040-4040-404040404042',
   '30303030-3030-3030-3030-303030303032',
   'ccccccc2-cccc-cccc-cccc-ccccccccccc2',
   'DELIVERED',
   now() - interval '50 minutes',
   now() - interval '35 minutes',
   now() - interval '10 minutes',
   null,
   null
  );

insert into delivery.delivery_events (id, delivery_id, event, note) values
  ('41414141-4141-4141-4141-414141414171', '40404040-4040-4040-4040-404040404042', 'ACCEPTED',   'Driver accepted'),
  ('41414141-4141-4141-4141-414141414172', '40404040-4040-4040-4040-404040404042', 'ON_THE_WAY',  'Driver is on the way'),
  ('41414141-4141-4141-4141-414141414173', '40404040-4040-4040-4040-404040404042', 'DELIVERED',  'Delivered to customer');

-- Delivery para orden #4 (Carlos): asignada a Maria, ready (sin pickup)
insert into delivery.deliveries (
  id, order_id, driver_user_id, status,
  accepted_at, picked_up_at, delivered_at, canceled_at, cancel_reason
) values
  ('40404040-4040-4040-4040-404040404043',
   '30303030-3030-3030-3030-303030303033',
   'ccccccc3-cccc-cccc-cccc-ccccccccccc3',
   'READY',
   now() - interval '3 minutes',
   null,
   null,
   null,
   null
  );

insert into delivery.delivery_events (id, delivery_id, event, note) values
  ('41414141-4141-4141-4141-414141414181', '40404040-4040-4040-4040-404040404043', 'ACCEPTED', 'Driver accepted (awaiting pickup)');

-- Delivery cancelada para orden #5 (Ana) (para probar cancel flow)
insert into delivery.deliveries (
  id, order_id, driver_user_id, status,
  accepted_at, picked_up_at, delivered_at, canceled_at, cancel_reason
) values
  ('40404040-4040-4040-4040-404040404044',
   '30303030-3030-3030-3030-303030303034',
   'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'CANCELED',
   now() - interval '20 minutes',
   null,
   null,
   now() - interval '15 minutes',
   'Customer canceled before pickup'
  );

insert into delivery.delivery_events (id, delivery_id, event, note) values
  ('41414141-4141-4141-4141-414141414191', '40404040-4040-4040-4040-404040404044', 'ACCEPTED', 'Driver accepted'),
  ('41414141-4141-4141-4141-414141414192', '40404040-4040-4040-4040-404040404044', 'CANCELED', 'Order canceled by customer');

-- NOTIFICATIONS OUTBOX: más eventos
insert into notifications.notification_outbox (
  id, type, status, to_email, order_id, customer_user_id,
  attempts, last_error, scheduled_at, sent_at
) values
  -- Orden #2 creada
  ('50505050-5050-5050-5050-505050505051', 'ORDER_CREATED', 'SENT',
   'sofia.customer@example.com', '30303030-3030-3030-3030-303030303031', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
   1, null, now() - interval '25 minutes', now() - interval '24 minutes'),

  -- Orden #2 asignada / on the way (si lo manejas con ese type)
  ('50505050-5050-5050-5050-505050505052', 'ORDER_ASSIGNED_ON_THE_WAY', 'PENDING',
   'sofia.customer@example.com', '30303030-3030-3030-3030-303030303031', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
   0, null, now(), null),

  -- Orden #3 creada
  ('50505050-5050-5050-5050-505050505053', 'ORDER_CREATED', 'SENT',
   'luis.customer@example.com', '30303030-3030-3030-3030-303030303032', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
   1, null, now() - interval '1 hour', now() - interval '59 minutes'),

  -- Orden #5 cancelada por customer
  ('50505050-5050-5050-5050-505050505054', 'ORDER_CANCELED_BY_CUSTOMER', 'SENT',
   'ana.customer@example.com', '30303030-3030-3030-3030-303030303034', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   1, null, now() - interval '15 minutes', now() - interval '14 minutes');

-- (Opcional) marcar pendiente como sent
update notifications.notification_outbox
set status = 'SENT', sent_at = now()
where id = '50505050-5050-5050-5050-505050505052';
