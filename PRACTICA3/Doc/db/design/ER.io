// =========================
// Enums
// =========================

Enum auth_code_type {
  EMAIL_VERIFICATION
  PASSWORD_RESET
  LOGIN_OTP
}

Enum order_status {
  CREATED
  IN_PROGRESS
  READY
  ON_THE_WAY
  DELIVERED
  CANCELED
  REJECTED
}

Enum notification_type {
  ORDER_CREATED
  ORDER_CANCELED_BY_CUSTOMER
  ORDER_ASSIGNED_ON_THE_WAY
  ORDER_CANCELED_BY_RESTAURANT_OR_DRIVER
  ORDER_REJECTED
}

Enum notification_status {
  PENDING
  SENT
  FAILED
}

// =========================
// AUTH SERVICE
// =========================

Table auth.roles {
  id uuid [pk, note: "UUID recommended"]
  code varchar(30) [not null, unique, note: "e.g., CUSTOMER, MERCHANT, DRIVER, ADMIN"]
  description varchar(255) [not null]
  is_system boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table auth.users {
  id uuid [pk]

  email varchar(320) [not null, unique]
  password varchar(255) [not null, note: "Store password hash, not plain text"]
  name varchar(120) [not null]
  phone_number varchar(20) [not null]

  role_id uuid [not null]

  is_active boolean [not null, default: true]
  email_verified boolean [not null, default: false]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Ref: auth.users.role_id > auth.roles.id

Table auth.auth_codes {
  id uuid [pk]
  user_id uuid [not null]

  code_hash varchar(255) [not null]
  type auth_code_type [not null]

  attempts int [not null, default: 0]
  max_attempts int [not null, default: 5]

  expires_at timestamptz [not null]
  used_at timestamptz

  destination varchar(320) [note: "Email or masked phone"]

  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (user_id)
    (type)
    (expires_at)
  }
}

Ref: auth.auth_codes.user_id > auth.users.id

// =========================
// CATALOG SERVICE
// =========================

Table catalog.merchant_types {
  id uuid [pk]

  code varchar(30) [not null, unique, note: "e.g., RESTAURANT, SUPERMARKET, PHARMACY, CONVENIENCE"]
  name varchar(100) [not null]
  description varchar(255)

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table catalog.restaurants {
  id uuid [pk]

  name varchar(120) [not null]
  address varchar(255) [not null]
  phone varchar(20)
  alias varchar(80)
  opening_hours varchar(120)

  is_active boolean [not null, default: true]
  merchant_type_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (merchant_type_id)
    (is_active)
  }
}

Ref: catalog.restaurants.merchant_type_id > catalog.merchant_types.id

Table catalog.restaurant_categories {
  id uuid [pk]

  name varchar(80) [not null, unique]
  description varchar(255)
  is_active boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table catalog.restaurant_category_map {
  restaurant_id uuid [not null]
  category_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (restaurant_id)
    (category_id)
    (restaurant_id, category_id) [unique]
  }
}

Ref: catalog.restaurant_category_map.restaurant_id > catalog.restaurants.id
Ref: catalog.restaurant_category_map.category_id > catalog.restaurant_categories.id

Table catalog.menu_items {
  id uuid [pk]
  restaurant_id uuid [not null]

  name varchar(120) [not null]
  description text

  price numeric(12,2) [not null, note: ">= 0"]
  currency char(3) [not null, default: "GTQ"]

  is_available boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (restaurant_id)
    (is_available)
  }
}

Ref: catalog.menu_items.restaurant_id > catalog.restaurants.id

Table catalog.menu_item_categories {
  id uuid [pk]
  restaurant_id uuid [not null]

  name varchar(80) [not null]
  description varchar(255)
  is_active boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (restaurant_id)
    (restaurant_id, name) [unique]
    (is_active)
  }
}

Ref: catalog.menu_item_categories.restaurant_id > catalog.restaurants.id

Table catalog.menu_item_category_map {
  menu_item_id uuid [not null]
  category_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (menu_item_id)
    (category_id)
    (menu_item_id, category_id) [unique]
  }
}

Ref: catalog.menu_item_category_map.menu_item_id > catalog.menu_items.id
Ref: catalog.menu_item_category_map.category_id > catalog.menu_item_categories.id

// =========================
// ORDER SERVICE
// =========================

Table orders.orders {
  id uuid [pk]

  customer_user_id uuid [not null, note: "External: auth.users.id"]
  restaurant_id uuid [not null, note: "External: catalog.restaurants.id"]

  status order_status [not null, default: "CREATED"]

  restaurant_name_snapshot varchar(120) [not null]
  delivery_address varchar(255) [not null]

  total_amount numeric(12,2) [not null, note: ">= 0"]
  currency char(3) [not null, default: "GTQ"]

  canceled_at timestamptz
  canceled_by_user_id uuid [note: "External: auth.users.id"]

  rejection_reason text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (customer_user_id)
    (restaurant_id)
    (status)
    (created_at)
  }
}

Table orders.order_items {
  id uuid [pk]
  order_id uuid [not null]

  menu_item_id uuid [not null, note: "External: catalog.menu_items.id"]

  item_name_snapshot varchar(120) [not null]

  unit_price numeric(12,2) [not null, note: ">= 0"]
  quantity int [not null, note: ">= 1"]
  line_total numeric(12,2) [not null, note: "unit_price * quantity"]

  Indexes {
    (order_id)
    (menu_item_id)
  }
}

Ref: orders.order_items.order_id > orders.orders.id


// =========================
// DELIVERY SERVICE
// =========================

Table delivery.deliveries {
  id uuid [pk]

  order_id uuid [not null, note: "External: orders.orders.id"]
  driver_user_id uuid [not null, note: "External: auth.users.id"]

  status order_status [not null, default: "READY"]

  accepted_at timestamptz
  picked_up_at timestamptz
  delivered_at timestamptz
  canceled_at timestamptz
  cancel_reason text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (order_id)
    (driver_user_id)
    (status)
    (created_at)
  }
}

Table delivery.delivery_events {
  id uuid [pk]
  delivery_id uuid [not null]

  event varchar(30) [not null, note: "ACCEPTED, ON_THE_WAY, DELIVERED, CANCELED"]
  note text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (delivery_id)
    (event)
    (created_at)
  }
}

Ref: delivery.delivery_events.delivery_id > delivery.deliveries.id

// =========================
// NOTIFICATION SERVICE
// =========================

Table notifications.notification_outbox {
  id uuid [pk]

  type notification_type [not null]
  status notification_status [not null, default: "PENDING"]

  to_email varchar(320) [not null]

  order_id uuid [note: "External: orders.orders.id"]
  customer_user_id uuid [note: "External: auth.users.id"]

  attempts int [not null, default: 0]
  last_error varchar(500)

  scheduled_at timestamptz
  sent_at timestamptz

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (status)
    (type)
    (to_email)
    (created_at)
  }
}

// =========================
// Table Groups
// =========================

TableGroup "Auth Service" {
  auth.roles
  auth.users
  auth.auth_codes
}

TableGroup "Catalog Service" {
  catalog.merchant_types
  catalog.restaurants
  catalog.restaurant_categories
  catalog.restaurant_category_map
  catalog.menu_items
  catalog.menu_item_categories
  catalog.menu_item_category_map
}

TableGroup "Order Service" {
  orders.orders
  orders.order_items
}

TableGroup "Delivery Service" {
  delivery.deliveries
  delivery.delivery_events
}

TableGroup "Notification Service" {
  notifications.notification_outbox
}
