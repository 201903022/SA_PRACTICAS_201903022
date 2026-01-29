

-- 1) Extensions (UUID generation)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS delivery;
CREATE SCHEMA IF NOT EXISTS notifications;

-- 3) Enums 
DO $$ BEGIN
  CREATE TYPE public.auth_code_type AS ENUM (
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'LOGIN_OTP'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'CREATED',
    'IN_PROGRESS',
    'READY',
    'ON_THE_WAY',
    'DELIVERED',
    'CANCELED',
    'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM (
    'ORDER_CREATED',
    'ORDER_CANCELED_BY_CUSTOMER',
    'ORDER_ASSIGNED_ON_THE_WAY',
    'ORDER_CANCELED_BY_RESTAURANT_OR_DRIVER',
    'ORDER_REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4) updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- AUTH SERVICE

CREATE TABLE IF NOT EXISTS auth.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  description varchar(255) NOT NULL,
  is_system boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_auth_roles_updated_at
BEFORE UPDATE ON auth.roles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL UNIQUE,
  password varchar(255) NOT NULL, -- store hash
  name varchar(120) NOT NULL,
  phone_number varchar(20) NOT NULL,
  role_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_auth_users_role
    FOREIGN KEY (role_id) REFERENCES auth.roles(id)
);

CREATE TRIGGER trg_auth_users_updated_at
BEFORE UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS auth.auth_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code_hash varchar(255) NOT NULL,
  type public.auth_code_type NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 5,
  expires_at timestamptz NOT NULL,
  used_at timestamptz NULL,
  destination varchar(320) NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_auth_codes_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT chk_auth_codes_attempts_nonneg
    CHECK (attempts >= 0),
  CONSTRAINT chk_auth_codes_max_attempts_pos
    CHECK (max_attempts > 0),
  CONSTRAINT chk_auth_codes_attempts_le_max
    CHECK (attempts <= max_attempts)
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_user_id ON auth.auth_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_codes_type ON auth.auth_codes(type);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON auth.auth_codes(expires_at);

-- CATALOG SERVICE

CREATE TABLE IF NOT EXISTS catalog.merchant_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  description varchar(255) NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_catalog_merchant_types_updated_at
BEFORE UPDATE ON catalog.merchant_types
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS catalog.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  address varchar(255) NOT NULL,
  phone varchar(20) NULL,
  alias varchar(80) NULL,
  opening_hours varchar(120) NULL,
  is_active boolean NOT NULL DEFAULT true,
  merchant_type_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_catalog_restaurants_merchant_type
    FOREIGN KEY (merchant_type_id) REFERENCES catalog.merchant_types(id)
);

CREATE INDEX IF NOT EXISTS idx_catalog_restaurants_merchant_type_id ON catalog.restaurants(merchant_type_id);
CREATE INDEX IF NOT EXISTS idx_catalog_restaurants_is_active ON catalog.restaurants(is_active);

CREATE TRIGGER trg_catalog_restaurants_updated_at
BEFORE UPDATE ON catalog.restaurants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS catalog.restaurant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL UNIQUE,
  description varchar(255) NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_catalog_restaurant_categories_updated_at
BEFORE UPDATE ON catalog.restaurant_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS catalog.restaurant_category_map (
  restaurant_id uuid NOT NULL,
  category_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_catalog_restaurant_category_map
    PRIMARY KEY (restaurant_id, category_id),
  CONSTRAINT fk_catalog_rcm_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES catalog.restaurants(id),
  CONSTRAINT fk_catalog_rcm_category
    FOREIGN KEY (category_id) REFERENCES catalog.restaurant_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_catalog_rcm_restaurant_id ON catalog.restaurant_category_map(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_rcm_category_id ON catalog.restaurant_category_map(category_id);

CREATE TABLE IF NOT EXISTS catalog.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  name varchar(120) NOT NULL,
  description text NULL,
  price numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'GTQ',
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_catalog_menu_items_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES catalog.restaurants(id),
  CONSTRAINT chk_catalog_menu_items_price_nonneg
    CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_catalog_menu_items_restaurant_id ON catalog.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_menu_items_is_available ON catalog.menu_items(is_available);

CREATE TRIGGER trg_catalog_menu_items_updated_at
BEFORE UPDATE ON catalog.menu_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS catalog.menu_item_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL,
  name varchar(80) NOT NULL,
  description varchar(255) NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_catalog_mic_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES catalog.restaurants(id),
  CONSTRAINT uq_catalog_mic_restaurant_name
    UNIQUE (restaurant_id, name)
);

CREATE INDEX IF NOT EXISTS idx_catalog_mic_restaurant_id ON catalog.menu_item_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_mic_is_active ON catalog.menu_item_categories(is_active);

CREATE TRIGGER trg_catalog_menu_item_categories_updated_at
BEFORE UPDATE ON catalog.menu_item_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS catalog.menu_item_category_map (
  menu_item_id uuid NOT NULL,
  category_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_catalog_menu_item_category_map
    PRIMARY KEY (menu_item_id, category_id),
  CONSTRAINT fk_catalog_micm_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES catalog.menu_items(id),
  CONSTRAINT fk_catalog_micm_category
    FOREIGN KEY (category_id) REFERENCES catalog.menu_item_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_catalog_micm_menu_item_id ON catalog.menu_item_category_map(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_catalog_micm_category_id ON catalog.menu_item_category_map(category_id);

-- ORDER SERVICE

CREATE TABLE IF NOT EXISTS orders.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- External references 
  customer_user_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,

  status public.order_status NOT NULL DEFAULT 'CREATED',

  restaurant_name_snapshot varchar(120) NOT NULL,
  delivery_address varchar(255) NOT NULL,

  total_amount numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'GTQ',

  canceled_at timestamptz NULL,
  canceled_by_user_id uuid NULL, -- External

  rejection_reason text NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chk_orders_total_amount_nonneg
    CHECK (total_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_user_id ON orders.orders(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders.orders(created_at);

CREATE TRIGGER trg_orders_orders_updated_at
BEFORE UPDATE ON orders.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS orders.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,

  -- External reference 
  menu_item_id uuid NOT NULL,

  item_name_snapshot varchar(120) NOT NULL,

  unit_price numeric(12,2) NOT NULL,
  quantity int NOT NULL,
  line_total numeric(12,2) NOT NULL,

  CONSTRAINT fk_orders_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders.orders(id),

  CONSTRAINT chk_orders_order_items_unit_price_nonneg
    CHECK (unit_price >= 0),
  CONSTRAINT chk_orders_order_items_quantity_pos
    CHECK (quantity >= 1),
  CONSTRAINT chk_orders_order_items_line_total_nonneg
    CHECK (line_total >= 0),

  -- Optional strictness: enforce computed total
  CONSTRAINT chk_orders_order_items_line_total_calc
    CHECK (line_total = unit_price * quantity)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON orders.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON orders.order_items(menu_item_id);


-- DELIVERY SERVICE


CREATE TABLE IF NOT EXISTS delivery.deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- External references 
  order_id uuid NOT NULL,
  driver_user_id uuid NOT NULL,

  status public.order_status NOT NULL DEFAULT 'READY',

  accepted_at timestamptz NULL,
  picked_up_at timestamptz NULL,
  delivered_at timestamptz NULL,
  canceled_at timestamptz NULL,
  cancel_reason text NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON delivery.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_user_id ON delivery.deliveries(driver_user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON delivery.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON delivery.deliveries(created_at);

CREATE TRIGGER trg_delivery_deliveries_updated_at
BEFORE UPDATE ON delivery.deliveries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS delivery.delivery_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid NOT NULL,
  event varchar(30) NOT NULL, -- ACCEPTED, ON_THE_WAY, DELIVERED, CANCELED
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_delivery_events_delivery
    FOREIGN KEY (delivery_id) REFERENCES delivery.deliveries(id)
);

CREATE INDEX IF NOT EXISTS idx_delivery_events_delivery_id ON delivery.delivery_events(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_events_event ON delivery.delivery_events(event);
CREATE INDEX IF NOT EXISTS idx_delivery_events_created_at ON delivery.delivery_events(created_at);


-- NOTIFICATION SERVICE


CREATE TABLE IF NOT EXISTS notifications.notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  type public.notification_type NOT NULL,
  status public.notification_status NOT NULL DEFAULT 'PENDING',

  to_email varchar(320) NOT NULL,

  -- External references 
  order_id uuid NULL,
  customer_user_id uuid NULL,

  attempts int NOT NULL DEFAULT 0,
  last_error varchar(500) NULL,

  scheduled_at timestamptz NULL,
  sent_at timestamptz NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chk_notifications_attempts_nonneg
    CHECK (attempts >= 0)
);

CREATE INDEX IF NOT EXISTS idx_notification_outbox_status ON notifications.notification_outbox(status);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_type ON notifications.notification_outbox(type);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_to_email ON notifications.notification_outbox(to_email);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_created_at ON notifications.notification_outbox(created_at);

CREATE TRIGGER trg_notifications_notification_outbox_updated_at
BEFORE UPDATE ON notifications.notification_outbox
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
