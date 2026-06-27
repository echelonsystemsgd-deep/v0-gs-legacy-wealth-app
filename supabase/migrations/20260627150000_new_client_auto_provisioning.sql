-- =============================================
-- Auto-Provisioning Trigger for New Projects
-- =============================================
-- When a new project is created, this trigger automatically:
-- 1. Posts a welcome update visible to the client in their updates feed
-- 2. Creates a standard onboarding action request for brand/business assets
-- This ensures every new client portal is fully provisioned with zero manual steps.

CREATE OR REPLACE FUNCTION auto_provision_new_project()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Insert a welcome project update visible to the client
  INSERT INTO project_updates (project_id, title, description, created_at)
  VALUES (
    NEW.id,
    'Project Initialised — Operations Commenced',
    'Your dedicated project workspace has been provisioned and our team has initiated the Discovery phase. Expect your first briefing transmission within 24–48 hours. All communications will be conducted through this secure portal.',
    NOW()
  );

  -- 2. Insert a standard onboarding action request (client must respond)
  INSERT INTO project_action_requests (project_id, title, description, status, created_at)
  VALUES (
    NEW.id,
    'Submit Your Brand & Business Assets',
    'To initiate the Discovery phase at full operational capacity, please provide the following:

1. Your current website URL (if applicable)
2. Any existing brand guidelines, logo files, or brand assets
3. A brief description of your target audience and ideal client profile
4. Any competitor or reference websites you admire and why
5. Your preferred visual style, colour palette, or design references
6. Any integrations required (e.g. booking systems, CRMs, payment processors)

Timely submission of these materials directly impacts your deployment timeline. Delays in provision may affect your target launch date.',
    'pending',
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to projects table
DROP TRIGGER IF EXISTS trg_auto_provision_project ON projects;
CREATE TRIGGER trg_auto_provision_project
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION auto_provision_new_project();
