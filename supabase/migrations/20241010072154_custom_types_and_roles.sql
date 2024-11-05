-- Custom types for roles and permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'contributor');
CREATE TYPE public.app_permission AS ENUM (
  'places.create',
  'places.update',
  'places.delete',
  'entrances.create',
  'entrances.update',
  'entrances.delete',
  'photos.upload',
  'photos.delete',
  'changes.approve',
  'changes.reject',
  'users.manage'
);

COMMENT ON TYPE public.app_permission IS E'@graphql({"mappings": {
  "places.create": "PLACES_CREATE",
  "places.update": "PLACES_UPDATE",
  "places.delete": "PLACES_DELETE",
  "entrances.create": "ENTRANCES_CREATE",
  "entrances.update": "ENTRANCES_UPDATE",
  "entrances.delete": "ENTRANCES_DELETE",
  "photos.upload": "PHOTOS_UPLOAD",
  "photos.delete": "PHOTOS_DELETE",
  "changes.approve": "CHANGES_APPROVE",
  "changes.reject": "CHANGES_REJECT",
  "users.manage": "USERS_MANAGE"
}})';

-- Roles
CREATE ROLE admin;
CREATE ROLE moderator;

-- Users table
CREATE TABLE "public"."users" (
    "id" uuid NOT NULL PRIMARY KEY,
    "email" text,
    "first_name" text,
    "last_name" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);

-- USER ROLES
CREATE TABLE public.user_roles (
  id        BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id   UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role      public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);
COMMENT ON TABLE public.user_roles IS 'Application roles for each user.';

-- ROLE PERMISSIONS
CREATE TABLE public.role_permissions (
  id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  role         public.app_role NOT NULL,
  permission   public.app_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (role, permission)
);
COMMENT ON TABLE public.role_permissions IS 'Application permissions for each role.';

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
  ('admin', 'places.create'),
  ('admin', 'places.update'),
  ('admin', 'places.delete'),
  ('admin', 'entrances.create'),
  ('admin', 'entrances.update'),
  ('admin', 'entrances.delete'),
  ('admin', 'photos.upload'),
  ('admin', 'photos.delete'),
  ('admin', 'changes.approve'),
  ('admin', 'changes.reject'),
  ('admin', 'users.manage'),
  ('moderator', 'places.create'),
  ('moderator', 'places.update'),
  ('moderator', 'entrances.create'),
  ('moderator', 'entrances.update'),
  ('moderator', 'photos.upload'),
  ('moderator', 'changes.approve'),
  ('moderator', 'changes.reject'),
  ('contributor', 'places.create'),
  ('contributor', 'entrances.create'),
  ('contributor', 'photos.upload');

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, required_permission public.app_permission)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = user_has_permission.user_id
      AND rp.permission = user_has_permission.required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign a role to a user
CREATE OR REPLACE FUNCTION public.assign_role(p_user_id UUID, p_role public.app_role)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove a role from a user
CREATE OR REPLACE FUNCTION public.remove_role(p_user_id UUID, p_role public.app_role)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.user_roles
  WHERE user_roles.user_id = remove_role.p_user_id
    AND user_roles.role = remove_role.p_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- RLS Policies for user_roles table
CREATE POLICY "Allow read access for authenticated users" ON public.user_roles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow insert for admins" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

CREATE POLICY "Allow update for admins" ON public.user_roles
FOR UPDATE TO authenticated
USING (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

CREATE POLICY "Allow delete for admins" ON public.user_roles
FOR DELETE TO authenticated
USING (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

-- RLS Policies for role_permissions table
CREATE POLICY "Allow read access for all users" ON public.role_permissions
FOR SELECT TO public
USING (true);

CREATE POLICY "Allow insert for admins" ON public.role_permissions
FOR INSERT TO authenticated
WITH CHECK (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

CREATE POLICY "Allow update for admins" ON public.role_permissions
FOR UPDATE TO authenticated
USING (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

CREATE POLICY "Allow delete for admins" ON public.role_permissions
FOR DELETE TO authenticated
USING (public.user_has_permission(auth.uid(), 'users.manage'::public.app_permission));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;