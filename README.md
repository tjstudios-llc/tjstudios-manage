# TJ Studios Manage

TJ Studios Manage is a Docker-host management dashboard built with Next.js, React, and Tailwind CSS.

## Current status

The repository currently contains the dashboard UI foundation. It is **not yet connected** to a Docker Engine or a TJ Studios host agent.

To keep operational information trustworthy, the dashboard does not display fabricated container counts, host metrics, or resource usage. The overview shows an explicit disconnected state until a real, authenticated data source is available.

### Planned capabilities

- Container inventory, status, logs, and lifecycle operations
- Docker image and registry management
- Docker network and volume management
- Host CPU, memory, disk, and availability metrics
- Authenticated access and role-based permissions
- Audit history for administrative actions

These are planned capabilities, not currently available features.

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- pnpm

## Requirements

- Node.js 22 or newer
- pnpm

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Security architecture requirements

A future Docker integration must not expose the Docker socket directly to the public-facing Next.js application. Host operations should be performed through a separately authenticated host agent or restricted control service with:

- Explicitly allowlisted operations
- Strong service-to-service authentication
- Authorization checks for every administrative action
- Input validation and bounded resource limits
- Audit logging for state-changing operations

Do not treat the current UI as a production Docker control plane until those integrations and controls are implemented and tested.
