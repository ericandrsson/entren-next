-- Create the auth.hooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.hooks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hook_name text NOT NULL UNIQUE,
  hook_function_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the auth hook function
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role public.app_role;
BEGIN
  -- Fetch the user role from the user_roles table
  SELECT role INTO user_role FROM public.user_roles WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    -- Set the claim
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  ELSE
    claims := jsonb_set(claims, '{user_role}', '"contributor"'::jsonb);
  END IF;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Return the modified event
  RETURN event;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;

REVOKE ALL ON TABLE public.user_roles FROM authenticated, anon, public;

-- Create a policy to allow auth admin to read user roles
CREATE POLICY "Allow auth admin to read user roles" 
ON public.user_roles
FOR SELECT
TO supabase_auth_admin
USING (true);

-- Enable RLS on the user_roles table if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add this function to the hook in the auth.hooks table
INSERT INTO auth.hooks (hook_name, hook_function_name)
VALUES ('custom_access_token', 'public.custom_access_token_hook')
ON CONFLICT (hook_name) DO UPDATE
SET hook_function_name = EXCLUDED.hook_function_name;
