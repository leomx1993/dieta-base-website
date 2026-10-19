# AGENTS.md — Frontend Development Rules

## 1. General Rules

- Read the existing codebase before making changes.
- Follow the project's existing conventions whenever they do not conflict with these rules.
- Do not introduce unnecessary dependencies, abstractions, or architectural changes.
- Do not modify unrelated files.
- Do not assume that a feature, component, type, hook, or utility does not exist before searching the codebase.
- Prefer simple, readable, maintainable solutions over clever or unnecessarily complex implementations.
- Do not leave placeholder implementations, fake data, or unfinished code unless explicitly requested.
- Do not silently ignore errors or hide them with unsafe fallbacks.
- Before finishing a task, review the changes for consistency, duplication, and TypeScript errors.

## 2. Component Architecture

All React components must belong to exactly one of these three categories:

- `domain/`: Components specific to DietaBase business concepts, such as patients, appointments, assessments, foods, and meal plans.
- `layout/`: Components responsible for page structure and layout, such as sidebars, headers, navigation, and page containers.
- `ui/`: Small, generic, reusable interface components, such as buttons, inputs, dialogs, badges, and cards.

Use the existing project structure if it already implements these categories. Do not create competing component directories.

### Component organization

Every component must have its own dedicated folder.

Use this structure:

```text
components/
├── domain/
│   └── patient-card/
│       ├── index.ts
│       └── patient-card.tsx
├── layout/
│   └── app-sidebar/
│       ├── index.ts
│       └── app-sidebar.tsx
└── ui/
    └── button/
        ├── index.ts
        └── button.tsx
```

Rules:

- Every component folder must contain its component file and an `index.ts` entry point.
- Do not place component files directly inside `domain/`, `layout/`, or `ui/`.
- Do not create nested component folders. Components must not be placed inside another component's folder.
- Do not duplicate the same component across multiple categories or folders.
- Do not declare standalone React components inside another component's `.tsx` file.
- Extract reusable or independently meaningful components into their own dedicated folders.
- Keep a component focused on one clear responsibility.
- Use named exports unless the existing project consistently follows another convention.

## 3. Separation of Concerns

Do not declare interfaces, types, or general-purpose utilities inside component files.

Keep responsibilities separated:

- `components/`: React components and their presentation.
- `types/`: Shared TypeScript types.
- `interfaces/`: Shared interfaces when required by the existing architecture.
- `utils/`: Pure, reusable utility functions.
- `hooks/`: Reusable React hooks.
- `services/`: API communication and other external service integrations.

Inspect the current repository before creating these directories. Reuse existing locations and conventions instead of creating duplicate structures.

Component-specific types may live in a separate file within that component's folder if necessary. Shared types must be defined in the appropriate shared directory.

Do not create interfaces, types, hooks, or utilities merely to satisfy an architectural pattern. Create them when they have a clear purpose.

## 4. TypeScript

- Avoid `any`. Use explicit types or `unknown` when the type is genuinely uncertain.
- Avoid duplicating type definitions.
- Reuse existing shared types where appropriate.
- Do not use type assertions to bypass errors without a valid reason.
- Keep API response types separate from UI-specific view models when their structures differ.
- Handle optional and nullable values explicitly.
- Do not suppress TypeScript errors to make the build pass.

## 5. React and Next.js

- Follow the Next.js conventions already established in the repository.
- Use Server Components by default when working with the App Router.
- Add `"use client"` only when client-side state, effects, event handlers, or browser APIs are needed.
- Do not turn an entire page or layout into a Client Component unnecessarily.
- Keep business logic out of presentation components when it can reasonably be extracted into hooks or separate modules.
- Avoid unnecessary `useEffect`, duplicated state, and redundant data fetching.
- Use stable keys when rendering lists.
- Do not create components inside render functions or other components.
- Follow the existing routing and page organization.

## 6. Styling

- Use Tailwind CSS and the project's existing styling conventions.
- Prefer `className` and existing reusable styling utilities.
- Reuse existing UI components and design tokens before creating new ones.
- Avoid inline styles unless they are genuinely necessary.
- Avoid nested ternary expressions in JSX. Use early returns, variables, or clearer conditional rendering.
- Do not introduce a second styling system without explicit approval.
- Keep the interface visually consistent across pages.

## 7. API Integration

- The frontend must communicate with the backend through the established API layer.
- Do not access the database directly from frontend code.
- Do not put database credentials, private API keys, or other secrets in frontend code.
- Do not implement authentication flows directly against AWS Cognito unless explicitly instructed. Authentication integration must follow the backend-driven architecture established for this project.
- Reuse existing API clients, services, types, and error-handling conventions.
- Do not duplicate API requests across components when a shared service or hook is appropriate.
- Handle loading, empty, success, and error states explicitly.
- Do not use hardcoded mock data as if it were real API data.
- Keep environment-specific configuration in environment variables and never expose secrets through public frontend variables.

## 8. Forms and Validation

- Follow existing form and validation libraries already installed in the project.
- Avoid adding another form library without a clear need and explicit justification.
- Validate user input and display understandable error messages.
- Prevent duplicate submissions when appropriate.
- Preserve entered values when validation fails.
- Keep validation rules reusable when the same rules apply in multiple places.

## 9. Business Logic

- Do not invent DietaBase business rules, nutritional formulas, or calculation methods.
- Do not invent API endpoints or assume request and response formats.
- Inspect the backend contracts and existing documentation when available.
- If an implementation depends on a missing business rule or API contract, identify the uncertainty instead of silently guessing.
- Keep nutritional calculations and other domain logic separate from UI components.
- Use consistent units and explicit conversions wherever measurements are involved.

## 10. Dependencies and Project Configuration

- Inspect `package.json` and the lockfile before proposing dependencies.
- Prefer existing dependencies when they adequately solve the problem.
- Do not replace package managers, modify build tools, or change major dependency versions without approval.
- Do not overwrite configuration files without inspecting their current contents.
- Do not introduce new architectural conventions without explaining why they are necessary.

## 11. Before Completing a Task

Verify the following whenever applicable:

1. The implementation follows these architectural rules.
2. Existing components, types, and utilities were reused where appropriate.
3. No duplicate components or unnecessary abstractions were introduced.
4. TypeScript checks and relevant linting or tests pass.
5. Loading, empty, and error states are handled.
6. No secrets or real credentials were added to the code.
7. Only files relevant to the requested task were changed.

Report any checks that could not be executed. Never claim that a test, lint, or build passed unless it was actually run successfully.

## 12. When Requirements Are Unclear

- Do not make consequential architectural decisions based on assumptions.
- Inspect the repository and available documentation first.
- Ask for clarification when a missing requirement materially affects the implementation.
- For minor implementation details, choose the simplest solution consistent with the existing architecture.
- Do not expand the requested scope without a clear reason.

**These rules apply to all frontend implementation tasks unless the user explicitly overrides a specific rule.**
