import Link from 'next/link'

export function AccountShell({ children }: { children: React.ReactNode }) {
  return <section className="section"><div className="container account-grid"><aside className="account-sidebar"><h2>My Account</h2><Link href="/account">Dashboard</Link><Link href="/account/profile">Profile</Link><Link href="/account/pets">Pets</Link><Link href="/account/pet-registrations">Pet Registrations</Link><Link href="/account/boarding">Boarding</Link><Link href="/account/settings">Settings</Link><form action="/api/auth/logout" method="post"><button className="btn btn-primary">Logout</button></form></aside><div>{children}</div></div></section>
}
export function SimpleTable({ rows, columns }: { rows: Record<string, unknown>[]; columns: { key: string; label: string }[] }) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.length ? rows.map((r, i) => <tr key={String(r.id || i)}>{columns.map((c) => <td key={c.key}>{String(r[c.key] ?? '-')}</td>)}</tr>) : <tr><td colSpan={columns.length}>No records yet.</td></tr>}</tbody></table></div>
}
