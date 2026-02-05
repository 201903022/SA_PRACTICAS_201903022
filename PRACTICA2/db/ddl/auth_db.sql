CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TYPE public.auth_code_type AS ENUM (
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'LOGIN_OTP'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    code varchar(30) NOT NULL UNIQUE,
    description varchar(255) NOT NULL,
    is_system boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_auth_roles_updated_at ON roles;

CREATE TRIGGER trg_auth_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    email varchar(320) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    name varchar(120) NOT NULL,
    phone_number varchar(20), -- Removido NOT NULL por si el registro es solo por email
    role_id uuid NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    email_verified boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_auth_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
);

DROP TRIGGER IF EXISTS trg_auth_users_updated_at ON users;

CREATE TRIGGER trg_auth_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS auth_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid NOT NULL,
    code_hash varchar(255) NOT NULL,
    type auth_code_type NOT NULL, -- Ahora el tipo existe
    attempts int NOT NULL DEFAULT 0,
    max_attempts int NOT NULL DEFAULT 5,
    expires_at timestamptz NOT NULL,
    used_at timestamptz NULL,
    destination varchar(320) NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_auth_codes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chk_auth_codes_attempts_nonneg CHECK (attempts >= 0),
    CONSTRAINT chk_auth_codes_max_attempts_pos CHECK (max_attempts > 0),
    CONSTRAINT chk_auth_codes_attempts_le_max CHECK (attempts <= max_attempts)
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_user_id ON auth_codes (user_id);

CREATE INDEX IF NOT EXISTS idx_auth_codes_type_status ON auth_codes(type, used_at) WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON auth_codes (expires_at);