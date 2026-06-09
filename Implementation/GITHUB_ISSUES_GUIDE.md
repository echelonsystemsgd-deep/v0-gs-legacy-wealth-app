# GitHub Issues Management Guide

This guide defines the mandatory workflow and discipline for managing GitHub issues during the development of the **GS Legacy Wealth AI** web application. Every AI developer agent working on this codebase **must** read, understand, and strictly adhere to this protocol.

---

## 📌 Repository Coordinates

When calling the GitHub MCP tools, always use these parameters:
- **Owner**: `echelonsystemsgd-deep`
- **Repo**: `v0-gs-legacy-wealth-app`

---

## 🔄 The Life Cycle of a Development Session

Every chat session with an AI developer agent must follow this flow:

### 1. Discovery & Alignment (Start of Chat)
* **Verify Identity**: Call `github-mcp-server/get_me` to ensure you are authenticated and understand your permissions.
* **Scan Issues**: Check for existing issues related to the user's request:
  - For general listings, use `github-mcp-server/list_issues` (with pagination if there are many).
  - For specific keywords, use `github-mcp-server/search_issues` (e.g. `state:open type:issue`).
* **Identify or Create the Issue**:
  - If a matching open issue exists, confirm it with the user.
  - If no issue exists for the requested task, **you must create one** before writing any code.

### 2. Creating an Issue
When creating a new issue, use `github-mcp-server/issue_write` with `method: "create"`.
* **Title Format**: Use semantic prefixes to categorize the work:
  - `feat: <summary>` for new features (e.g., `feat: add Google Font typography and rich animations`)
  - `fix: <summary>` for bug fixes (e.g., `fix: resolve Calendly webhook auth state mismatch`)
  - `refactor: <summary>` for non-breaking code structure changes
  - `docs: <summary>` for documentation updates
  - `chore: <summary>` for dependency updates or configuration changes
* **Labels**: Apply relevant labels: `["feature"]`, `["bug"]`, `["refactor"]`, `["documentation"]`, `["enhancement"]`.
* **Assignees**: Assign the issue to the current logged-in username (returned by `get_me`).
* **Issue Body Template**: Use the standard template below to format the description.

### 3. Updating Progress (During Chat)
* **Check off Tasks**: If the issue description has markdown checkboxes, update the description (using `issue_write` with `method: "update"`) and check off items as they are completed.
* **Leave Comments**: For significant design decisions, blocker notifications, or technical pivots, call `github-mcp-server/add_issue_comment` to document the context for the user and future agents.
* **Commit Reference**: Mention the issue number (e.g. `#14`) in your implementation plans, walkthroughs, and commit messages.

### 4. Closing the Issue (End of Chat)
* Once the work is successfully tested and verified:
  1. Add a final comment to the issue summarizing the changes, files modified, and verification results.
  2. Close the issue using `github-mcp-server/issue_write` with:
     - `method: "update"`
     - `issue_number: <number>`
     - `state: "closed"`
     - `state_reason: "completed"` (or `"not_planned"` / `"duplicate"` if applicable).

---

## 📝 Issue Description Template

Always format the `body` parameter when creating or updating an issue as follows:

```markdown
## 🎯 Goal
A clear, concise description of what needs to be accomplished and why.

## 🛠️ Planned Tasks
- [ ] Task 1: Core setup and design system
- [ ] Task 2: Component development / Logic integration
- [ ] Task 3: API or Supabase integration
- [ ] Task 4: Responsive styling and Polish

## 🧪 Verification Plan
- **Automated Verification**: (e.g., `npm run build` or running specific tests)
- **Manual Verification**: (e.g., test steps to perform in browser or dashboard)

## 📌 Associated Milestone / Context
Specify if this relates to a specific release, project phase, or epic.
```

---

## 🛠️ GitHub MCP Tool Quick Reference

Use these tools to carry out the steps defined in this guide:

| Action | MCP Tool Name | Key Arguments |
| :--- | :--- | :--- |
| **Get Authenticated User** | `get_me` | `{}` |
| **List Repository Issues** | `list_issues` | `{"owner": "echelonsystemsgd-deep", "repo": "v0-gs-legacy-wealth-app", "state": "OPEN"}` |
| **Search Specific Issues** | `search_issues` | `{"query": "your keywords state:open type:issue"}` |
| **Read Issue Details** | `issue_read` | `{"method": "get", "owner": "echelonsystemsgd-deep", "repo": "v0-gs-legacy-wealth-app", "issue_number": 12}` |
| **Create a New Issue** | `issue_write` | `{"method": "create", "owner": "echelonsystemsgd-deep", "repo": "v0-gs-legacy-wealth-app", "title": "feat: ...", "body": "...", "assignees": ["username"], "labels": ["feature"]}` |
| **Update / Close Issue** | `issue_write` | `{"method": "update", "owner": "echelonsystemsgd-deep", "repo": "v0-gs-legacy-wealth-app", "issue_number": 12, "state": "closed", "state_reason": "completed"}` |
| **Add Comment to Issue** | `add_issue_comment` | `{"owner": "echelonsystemsgd-deep", "repo": "v0-gs-legacy-wealth-app", "issue_number": 12, "body": "comment text"}` |
