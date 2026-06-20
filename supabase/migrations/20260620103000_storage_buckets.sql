-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('portfolio', 'portfolio', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('testimonials', 'testimonials', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('branding', 'branding', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml']),
    ('website-media', 'website-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public, 
    file_size_limit = EXCLUDED.file_size_limit, 
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-assets', 'project-assets', false, 52428800)
ON CONFLICT (id) DO UPDATE SET 
    public = false, 
    file_size_limit = 52428800;

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on conflict
DROP POLICY IF EXISTS "Public select access for public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners and admins to select project assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to insert into public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to insert project assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners and admins to update project assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete from public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners and admins to delete project assets" ON storage.objects;

-- SELECT policies
CREATE POLICY "Public select access for public buckets" ON storage.objects
FOR SELECT
USING (bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media'));

CREATE POLICY "Allow owners and admins to select project assets" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'project-assets' AND (
    public.is_admin() OR
    (split_part(name, '/', 1) = auth.uid()::text)
  )
);

-- INSERT policies
CREATE POLICY "Allow admins to insert into public buckets" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media') AND
  public.is_admin()
);

CREATE POLICY "Allow authenticated users to insert project assets" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-assets'
);

-- UPDATE policies
CREATE POLICY "Allow admins to update public buckets" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media') AND
  public.is_admin()
)
WITH CHECK (
  bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media') AND
  public.is_admin()
);

CREATE POLICY "Allow owners and admins to update project assets" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-assets' AND (
    public.is_admin() OR
    (split_part(name, '/', 1) = auth.uid()::text)
  )
)
WITH CHECK (
  bucket_id = 'project-assets' AND (
    public.is_admin() OR
    (split_part(name, '/', 1) = auth.uid()::text)
  )
);

-- DELETE policies
CREATE POLICY "Allow admins to delete from public buckets" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media') AND
  public.is_admin()
);

CREATE POLICY "Allow owners and admins to delete project assets" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'project-assets' AND (
    public.is_admin() OR
    (split_part(name, '/', 1) = auth.uid()::text)
  )
);
