@echo off

git add frontend/src/types/
git commit -m "feat(types): create comprehensive TypeScript type definitions"

git add frontend/src/services/
git commit -m "feat(api): create axios instance with interceptors"

git add frontend/src/context/
git commit -m "feat(auth): implement AuthContext for global state management"

git add frontend/src/hooks/useAuth.ts
git commit -m "feat(hooks): create custom useAuth hook for auth context access"

git add frontend/src/hooks/useDebounce.ts
git commit -m "feat(hooks): create useDebounce hook for search optimization"

git add frontend/src/hooks/useLeads.ts
git commit -m "feat(hooks): create useLeads hook for lead data management"

git add frontend/src/components/Auth/Login.tsx
git commit -m "feat(auth): implement login page with form validation"

git add frontend/src/components/Auth/Register.tsx
git commit -m "feat(auth): implement registration page with password validation"

git add frontend/src/components/Auth/ProtectedRoute.tsx
git commit -m "feat(auth): implement ProtectedRoute component"

git add frontend/src/components/Dashboard/FilterPanel.tsx
git commit -m "feat(ui): create FilterPanel component for search and filters"

git add frontend/src/components/Dashboard/LeadTable.tsx
git commit -m "feat(ui): create LeadTable component with formatted data"

git add frontend/src/components/Dashboard/LeadForm.tsx
git commit -m "feat(ui): create LeadForm component for CRUD operations"

git add frontend/src/components/Common/Navbar.tsx
git commit -m "feat(ui): create Navbar component with user info and logout"

git add frontend/src/components/Common/LoadingSpinner.tsx
git commit -m "feat(ui): create LoadingSpinner component for async operations"

git add frontend/src/pages/DashboardPage.tsx
git commit -m "feat(pages): create DashboardPage with full lead management"

git add frontend/src/utils/csvExport.ts
git commit -m "feat(export): implement CSV export functionality"

git add frontend/src/App.tsx frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx frontend/src/main.tsx
git commit -m "feat(routing): set up React Router with protected routes"

git add frontend/src/index.css frontend/tailwind.config.js frontend/postcss.config.js frontend/vite.config.ts frontend/index.html
git commit -m "style: implement Tailwind CSS responsive design"

git add SUBMISSION.md
git commit -m "docs: create SUBMISSION.md with all required details"

git add .
git commit -m "chore: finalize frontend environment, configuration, and dependencies"
