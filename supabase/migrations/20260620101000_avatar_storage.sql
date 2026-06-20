-- Create private avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars', 
    'avatars', 
    false, 
    1048576, -- 1MB file size limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
    public = false, 
    file_size_limit = 1048576, 
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Authenticated users can read their own avatars (folder name = user_id), and admins can read all avatars
CREATE POLICY "Allow owners and admins to select avatars" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'avatars' AND (
    split_part(name, '/', 1) = auth.uid()::text OR
    public.is_admin()
  )
);

-- 2. INSERT POLICY: Authenticated users can upload avatars strictly to their own user_id subfolder
CREATE POLICY "Allow owners to insert avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  split_part(name, '/', 1) = auth.uid()::text
);

-- 3. UPDATE POLICY: Authenticated users can update avatars strictly in their own user_id subfolder
CREATE POLICY "Allow owners to update avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  split_part(name, '/', 1) = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  split_part(name, '/', 1) = auth.uid()::text
);

-- 4. DELETE POLICY: Authenticated users can delete avatars strictly in their own user_id subfolder
CREATE POLICY "Allow owners to delete avatars" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  split_part(name, '/', 1) = auth.uid()::text
);
