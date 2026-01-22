import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/payrolls')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/payrolls"!</div>
}
