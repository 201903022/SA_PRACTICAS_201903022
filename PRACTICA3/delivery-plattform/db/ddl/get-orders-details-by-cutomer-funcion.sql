CREATE OR REPLACE FUNCTION orders.get_orders_by_customer(p_customer_user_id uuid)
RETURNS TABLE (
  order_id uuid,
  status public.order_status,
  restaurant_id uuid,
  restaurant_name_snapshot varchar,
  delivery_address varchar,
  total_amount numeric(12,2),
  currency char(3),
  canceled_at timestamptz,
  canceled_by_user_id uuid,
  rejection_reason text,
  created_at timestamptz,
  updated_at timestamptz,
  items jsonb
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    o.id AS order_id,
    o.status,
    o.restaurant_id,
    o.restaurant_name_snapshot,
    o.delivery_address,
    o.total_amount,
    o.currency,
    o.canceled_at,
    o.canceled_by_user_id,
    o.rejection_reason,
    o.created_at,
    o.updated_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', oi.id,
          'menu_item_id', oi.menu_item_id,
          'item_name_snapshot', oi.item_name_snapshot,
          'unit_price', oi.unit_price,
          'quantity', oi.quantity,
          'line_total', oi.line_total
        )
        ORDER BY oi.item_name_snapshot
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'::jsonb
    ) AS items
  FROM orders.orders o
  LEFT JOIN orders.order_items oi
    ON oi.order_id = o.id
  WHERE o.customer_user_id = p_customer_user_id
  GROUP BY o.id
  ORDER BY o.created_at DESC;
$$;
-- 663a0942-aa68-47df-bb71-87f33008fa37
-- * Test function
SELECT * FROM orders.get_orders_by_customer('663a0942-aa68-47df-bb71-87f33008fa37'::uuid);