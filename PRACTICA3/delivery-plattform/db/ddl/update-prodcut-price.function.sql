CREATE OR REPLACE FUNCTION catalog.update_menu_item_price(
  p_menu_item_id uuid,
  p_new_price numeric(12,2)
)
RETURNS TABLE (
  menu_item_id uuid,
  restaurant_id uuid,
  name varchar,
  price numeric(12,2),
  currency char(3),
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_new_price IS NULL OR p_new_price < 0 THEN
    RAISE EXCEPTION 'Invalid price % (must be >= 0)', p_new_price;
  END IF;

  RETURN QUERY
  UPDATE catalog.menu_items mi
  SET price = p_new_price
  WHERE mi.id = p_menu_item_id
  RETURNING
    mi.id AS menu_item_id,
    mi.restaurant_id,
    mi.name,
    mi.price,
    mi.currency,
    mi.updated_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Menu item with id % does not exist', p_menu_item_id;
  END IF;
END;
$$;
