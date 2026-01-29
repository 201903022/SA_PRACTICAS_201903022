# DeliverEats — Explicacion breve del diagrama de actividades (4 carriles)

El diagrama muestra el **flujo completo** del sistema usando 4 carriles para separar responsabilidades:

- **Customer (Web/Mobile):** acciones del cliente (explorar, ordenar, cancelar, reset de contraseña).
- **DeliverEats System:** reglas del negocio, cambios de estado, validaciones y notificaciones (outbox).
- **Merchant (Restaurant/Vendor):** acepta o rechaza pedidos y marca cuando están listos.
- **Driver (Courier):** acepta entregas, recoge y entrega pedidos.

---

## Flujos principales

### 1) Recuperar contraseña 

1. Customer solicita reset por email.
2. System crea `auth_code (PASSWORD_RESET)` y genera notificación (outbox).
3. Customer ingresa código + nueva contraseña.
4. System valida código (vigente/no expirado) y actualiza el password.

---

### 2) Crear pedido y procesarlo

1. Customer explora, selecciona restaurante, arma carrito y crea la orden.
2. System crea la orden y la deja en **`CREATED`**.
3. Merchant decide:
   - **Rechaza:** System pasa a **`REJECTED`** y notifica al cliente.
   - **Acepta:** System pasa a **`IN_PROGRESS`**, Merchant prepara y marca **`READY`**.
4. System inicia asignación de driver:
   - Si un driver no acepta, el sistema **reintenta** con otro.
   - Al aceptar: System pasa a **`ON_THE_WAY`**.
5. Driver entrega y System finaliza en **`DELIVERED`** + notificación.

---

### 3) Cancelar pedido (cliente)

- Customer solicita cancelar.
- System valida: si ya está **`DELIVERED`**, **no permite** cancelar.
- Si aún no se entregó: pasa a **`CANCELED`**, notifica al cliente y detiene preparación/entrega si aplica.

---

## Estados del pedido incluidos

**`CREATED → IN_PROGRESS → READY → ON_THE_WAY → DELIVERED`**  
Alternativos: **`REJECTED`**, **`CANCELED`**.
