
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


Table auth.roles {
  id uuid [pk, note: "UUID recommended"]
  code varchar [not null, unique, note: "e.g., CUSTOMER, MERCHANT, DRIVER, ADMIN"]
  description varchar [not null]
  is_system boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

Table auth.users {
  id uuid [pk]
  email varchar [not null, unique]
  password varchar [not null]
  name varchar [not null]
  phone_number varchar [not null]

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

  code_hash varchar [not null]
  type auth_code_type [not null]

  attempts int [not null, default: 0]
  max_attempts int [not null, default: 5]

  expires_at timestamptz [not null]
  used_at timestamptz

  destination varchar 

}

Ref: auth.auth_codes.user_id > auth.users.id


Table catalog.merchant_types {
  id uuid [pk]
  code varchar [not null, unique, note: "e.g., RESTAURANT, SUPERMARKET, PHARMACY, CONVENIENCE"]
  name varchar [not null]
  description varchar

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table catalog.restaurants {
  id uuid [pk]
  name varchar [not null]
  address varchar [not null]
  phone varchar
  alias varchar 
  opening_hours varchar
  is_active boolean [not null, default: true]

  merchant_type_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]


}

Ref: catalog.restaurants.merchant_type_id > catalog.merchant_types.id

Table catalog.restaurant_categories {
  id uuid [pk]
  name varchar [not null]
  description varchar
  is_active boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

Table catalog.restaurant_category_map {
  restaurant_id uuid [not null]
  category_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]

}

Ref: catalog.restaurant_category_map.restaurant_id > catalog.restaurants.id
Ref: catalog.restaurant_category_map.category_id > catalog.restaurant_categories.id

Table catalog.menu_items {
  id uuid [pk]
  restaurant_id uuid [not null]

  name varchar [not null]
  description text
  price double [not null, note: ">= 0"]
  currency char(3) [not null, default: "GTQ"]
  is_available boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

Ref: catalog.menu_items.restaurant_id > catalog.restaurants.id

Table catalog.menu_item_categories {
  id uuid [pk]
  restaurant_id uuid [not null]
  name varchar [not null]
  description varchar
  is_active boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

Ref: catalog.menu_item_categories.restaurant_id > catalog.restaurants.id

Table catalog.menu_item_category_map {
  menu_item_id uuid [not null]
  category_id uuid [not null]

  created_at timestamptz [not null, default: `now()`]


}

Ref: catalog.menu_item_category_map.menu_item_id > catalog.menu_items.id
Ref: catalog.menu_item_category_map.category_id > catalog.menu_item_categories.id


Table orders.orders {
  id uuid [pk]

  customer_user_id uuid [not null, note: "External: auth.users.id"]
  restaurant_id uuid [not null, note: "External: catalog.restaurants.id"]

  status order_status [not null, default: "CREATED"]

  restaurant_name_snapshot varchar [not null]
  delivery_address varchar [not null]

  total_amount_cents int [not null, note: ">= 0"]
  currency char(3) [not null, default: "GTQ"]

  canceled_at timestamptz
  canceled_by_user_id uuid [note: "External: auth.users.id"]
  canceled_by_role_code varchar [note: "Snapshot of auth.roles.code"]

  rejection_reason text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

Table orders.order_items {
  id uuid [pk]
  order_id uuid [not null]

  menu_item_id uuid [not null, note: "External: catalog.menu_items.id"]

  item_name_snapshot varchar [not null]
  unit_price_cents double [not null]
  quantity int [not null, note: ">= 1"]
  line_total_cents int [not null]

}

Ref: orders.order_items.order_id > orders.orders.id

Table orders.order_status_history {
  id uuid [pk]
  order_id uuid [not null]

  from_status order_status
  to_status order_status [not null]

  changed_by_user_id uuid [note: "External: auth.users.id"]

  note text
  created_at timestamptz [not null, default: `now()`]
}

Ref: orders.order_status_history.order_id > orders.orders.id


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


}

Table delivery.delivery_events {
  id uuid [pk]
  delivery_id uuid [not null]
  event varchar [not null, note: "ACCEPTED, ON_THE_WAY, DELIVERED, CANCELED"]
  note text
  created_at timestamptz [not null, default: `now()`]

}

Ref: delivery.delivery_events.delivery_id > delivery.deliveries.id


Table notifications.notification_outbox {
  id uuid [pk]

  type notification_type [not null]

  to_email varchar [not null]

  order_id uuid [note: "External: orders.orders.id"]
  customer_user_id uuid [note: "External: auth.users.id"]

  sent_at timestamptz

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

}

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
  orders.order_status_history
}

TableGroup "Delivery Service" {
  delivery.deliveries
  delivery.delivery_events
}

TableGroup "Notification Service" {
  notifications.notification_outbox
}


Ref: "orders"."order_status_history"."id" < "orders"."order_status_history"."from_status"