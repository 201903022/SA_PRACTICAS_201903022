CREATE OR REPLACE FUNCTION catalog.get_menu_items_by_restaurant(p_restaurant_id uuid)
RETURNS TABLE (
  id uuid,
  restaurant_id uuid,
  name varchar,
  description text,
  price numeric(12,2),
  currency char(3),
  is_available boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    mi.id,
    mi.restaurant_id,
    mi.name,
    mi.description,
    mi.price,
    mi.currency,
    mi.is_available,
    mi.created_at,
    mi.updated_at
  FROM catalog.menu_items mi
  WHERE mi.restaurant_id = p_restaurant_id
  ORDER BY mi.name;
$$;

-- * Test function
SELECT * 
FROM catalog.get_menu_items_by_restaurant('2d51a5e6-297b-4263-a630-1cfdb53a3374'::uuid);
