import { GateForm } from './GateForm'

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export const metadata = {
  title: 'Password Required',
}

export default async function GatePage({ searchParams }: Props) {
  const { redirect } = await searchParams
  return <GateForm redirect={redirect ?? '/'} />
}
