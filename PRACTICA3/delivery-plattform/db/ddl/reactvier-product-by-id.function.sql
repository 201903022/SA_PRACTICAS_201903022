CREATE OR REPLACE FUNCTION catalog.toggle_menu_item_availability(p_menu_item_id uuid)
RETURNS TABLE (
  id uuid,
  is_available boolean,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE catalog.menu_items
  SET is_available = NOT is_available
  WHERE id = p_menu_item_id
  RETURNING id, is_available, updated_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Menu item with id % does not exist', p_menu_item_id;
  END IF;
END;
$$;

-- Example usage:
SELECT * FROM catalog.toggle_menu_item_availability('e9b7a648-f811-4ecd-a6a7-d59f1a1d069c');