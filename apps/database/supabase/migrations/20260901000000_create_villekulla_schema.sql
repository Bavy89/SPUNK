-- Create a dedicated schema for Villekulla.
-- Skapweb uses the 'public' schema — this schema is completely separate.
CREATE SCHEMA IF NOT EXISTS villekulla;

GRANT USAGE ON SCHEMA villekulla TO postgres, anon, authenticated, service_role;

-- Shared utility function for updated_at timestamps
CREATE OR REPLACE FUNCTION villekulla.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

GRANT ALL ON FUNCTION villekulla.set_updated_at() TO anon, authenticated, service_role;

-- private_items
CREATE TABLE IF NOT EXISTS villekulla.private_items (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name varchar NOT NULL,
  description varchar NOT NULL,
  owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vk_private_items_owner_id ON villekulla.private_items (owner_id);
CREATE INDEX IF NOT EXISTS idx_vk_private_items_created_at ON villekulla.private_items (created_at DESC);

ALTER TABLE villekulla.private_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION villekulla.set_private_item_owner_id()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.owner_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

GRANT ALL ON FUNCTION villekulla.set_private_item_owner_id() TO anon, authenticated, service_role;

CREATE TRIGGER set_owner_id_on_insert
  BEFORE INSERT ON villekulla.private_items
  FOR EACH ROW EXECUTE FUNCTION villekulla.set_private_item_owner_id();

CREATE POLICY select_all_policy ON villekulla.private_items FOR SELECT USING (TRUE);
CREATE POLICY insert_auth_policy ON villekulla.private_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY update_own_policy ON villekulla.private_items FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY delete_own_policy ON villekulla.private_items FOR DELETE USING (auth.uid() = owner_id);

-- content_blog_posts
CREATE TABLE IF NOT EXISTS villekulla.content_blog_posts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS vk_blog_posts_slug_key ON villekulla.content_blog_posts (slug);
CREATE INDEX IF NOT EXISTS vk_blog_posts_author_id_idx ON villekulla.content_blog_posts (author_id);
CREATE INDEX IF NOT EXISTS vk_blog_posts_published_at_idx ON villekulla.content_blog_posts (is_published, published_at DESC);

CREATE TRIGGER set_updated_at_blog_posts
  BEFORE UPDATE ON villekulla.content_blog_posts
  FOR EACH ROW EXECUTE FUNCTION villekulla.set_updated_at();

ALTER TABLE villekulla.content_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_policy ON villekulla.content_blog_posts FOR SELECT
  USING (is_published OR auth.uid() = author_id OR auth.role() = 'service_role');
CREATE POLICY insert_policy ON villekulla.content_blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id OR auth.role() = 'service_role');
CREATE POLICY update_policy ON villekulla.content_blog_posts FOR UPDATE
  USING (auth.uid() = author_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = author_id OR auth.role() = 'service_role');
CREATE POLICY delete_policy ON villekulla.content_blog_posts FOR DELETE
  USING (auth.uid() = author_id OR auth.role() = 'service_role');

-- content_blog_post_comments
CREATE TABLE IF NOT EXISTS villekulla.content_blog_post_comments (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  blog_post_id uuid NOT NULL REFERENCES villekulla.content_blog_posts (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS vk_blog_comments_post_id_idx ON villekulla.content_blog_post_comments (blog_post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vk_blog_comments_author_id_idx ON villekulla.content_blog_post_comments (author_id);

CREATE TRIGGER set_updated_at_blog_comments
  BEFORE UPDATE ON villekulla.content_blog_post_comments
  FOR EACH ROW EXECUTE FUNCTION villekulla.set_updated_at();

ALTER TABLE villekulla.content_blog_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_policy ON villekulla.content_blog_post_comments FOR SELECT USING (TRUE);
CREATE POLICY insert_policy ON villekulla.content_blog_post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY update_policy ON villekulla.content_blog_post_comments FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY delete_policy ON villekulla.content_blog_post_comments FOR DELETE USING (auth.uid() = author_id);

-- Grants on all tables
GRANT ALL ON TABLE villekulla.private_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE villekulla.content_blog_posts TO anon, authenticated, service_role;
GRANT ALL ON TABLE villekulla.content_blog_post_comments TO anon, authenticated, service_role;

-- Default privileges for any future tables in this schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA villekulla
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA villekulla
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA villekulla
  GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
