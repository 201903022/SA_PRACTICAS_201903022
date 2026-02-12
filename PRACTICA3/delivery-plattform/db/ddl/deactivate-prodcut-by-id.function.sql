DROP FUNCTION IF EXISTS catalog.deactivate_menu_item (uuid);

CREATE FUNCTION catalog.deactivate_menu_item(p_menu_item_id uuid)
RETURNS TABLE (
  menu_item_id uuid,
  restaurant_id uuid,
  name varchar,
  is_available boolean,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM catalog.menu_items mi
    WHERE mi.id = p_menu_item_id
  ) THEN
    RAISE EXCEPTION 'Menu item with id % does not exist', p_menu_item_id;
  END IF;

  RETURN QUERY
  UPDATE catalog.menu_items mi
  SET is_available = false
  WHERE mi.id = p_menu_item_id
  RETURNING
    mi.id AS menu_item_id,
    mi.restaurant_id,
    mi.name,
    mi.is_available,
    mi.updated_at;
END;
$$;

-- Ejemplo de uso:
SELECT *
FROM catalog.deactivate_menu_item (
        '6e44a90c-d34d-4ee5-9c9d-31965754d02f'
    );