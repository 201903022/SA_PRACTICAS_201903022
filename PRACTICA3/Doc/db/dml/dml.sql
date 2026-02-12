--* ) 0 
select 'auth.roles' as table, count(*) from auth.roles
union all select 'auth.users', count(*) from auth.users
union all select 'auth.auth_codes', count(*) from auth.auth_codes
union all select 'catalog.merchant_types', count(*) from catalog.merchant_types
union all select 'catalog.restaurants', count(*) from catalog.restaurants
union all select 'catalog.restaurant_categories', count(*) from catalog.restaurant_categories
union all select 'catalog.restaurant_category_map', count(*) from catalog.restaurant_category_map
union all select 'catalog.menu_item_categories', count(*) from catalog.menu_item_categories
union all select 'catalog.menu_items', count(*) from catalog.menu_items
union all select 'catalog.menu_item_category_map', count(*) from catalog.menu_item_category_map
union all select 'orders.orders', count(*) from orders.orders
union all select 'orders.order_items', count(*) from orders.order_items
union all select 'delivery.deliveries', count(*) from delivery.deliveries
union all select 'delivery.delivery_events', count(*) from delivery.delivery_events
union all select 'notifications.notification_outbox', count(*) from notifications.notification_outbox;


--* 1) Listar ordenes con info del cliente y restaurante (join cross-schema)
SELECT
  o.id AS order_id,
  o.status,
  o.total_amount,
  o.currency,
  o.created_at,
  u.id AS customer_id,
  u.email AS customer_email,
  u.name AS customer_name,
  r.id AS restaurant_id,
  r.name AS restaurant_name,
  mt.code AS merchant_type
FROM orders.orders o
JOIN auth.users u
  ON u.id = o.customer_user_id
JOIN catalog.restaurants r
  ON r.id = o.restaurant_id
JOIN catalog.merchant_types mt
  ON mt.id = r.merchant_type_id
ORDER BY o.created_at DESC
LIMIT 50;


--*  2) Detalle completo de una orden (cabecera + items, con precios y totales)
SELECT
  o.id AS order_id,
  o.status,
  o.delivery_address,
  o.total_amount,
  o.currency,
  oi.id AS order_item_id,
  oi.item_name_snapshot,
  oi.unit_price,
  oi.quantity,
  oi.line_total
FROM orders.orders o
JOIN orders.order_items oi
  ON oi.order_id = o.id
WHERE o.id = '30303030-3030-3030-3030-303030303030'
ORDER BY oi.id;


--*  3) Top restaurantes por ventas (sumatoria de ordenes no canceladas/rechazadas)
SELECT
  r.id AS restaurant_id,
  r.name AS restaurant_name,
  COUNT(*) AS orders_count,
  SUM(o.total_amount) AS total_sales
FROM orders.orders o
JOIN catalog.restaurants r
  ON r.id = o.restaurant_id
WHERE o.status NOT IN ('CANCELED', 'REJECTED')
GROUP BY r.id, r.name
ORDER BY total_sales DESC
LIMIT 10;


--*  4) Items mas vendidos (por cantidad) por restaurante (usa snapshots)
SELECT
  r.name AS restaurant_name,
  oi.item_name_snapshot,
  SUM(oi.quantity) AS total_units_sold,
  SUM(oi.line_total) AS total_revenue
FROM orders.order_items oi
JOIN orders.orders o
  ON o.id = oi.order_id
JOIN catalog.restaurants r
  ON r.id = o.restaurant_id
WHERE o.status NOT IN ('CANCELED', 'REJECTED')
GROUP BY r.name, oi.item_name_snapshot
ORDER BY total_units_sold DESC
LIMIT 20;


--*  5) Estado de notificaciones (outbox) por usuario: pendientes/fallidas por email
SELECT
  u.email,
  COUNT(*) FILTER (WHERE n.status = 'PENDING') AS pending_count,
  COUNT(*) FILTER (WHERE n.status = 'FAILED')  AS failed_count,
  MAX(n.created_at) AS last_notification_created_at
FROM notifications.notification_outbox n
LEFT JOIN auth.users u
  ON u.email = n.to_email
GROUP BY u.email
ORDER BY failed_count DESC, pending_count DESC, last_notification_created_at DESC
LIMIT 50;
