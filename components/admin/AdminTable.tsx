interface AdminTableProps {
  title: string
  description: string
  columns: string[]
  rows?: Array<Record<string, unknown>>
}

export default function AdminTable({ title, description, columns, rows = [] }: AdminTableProps) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length}>No records found yet. Connect Supabase and start adding content.</td></tr>
            ) : rows.map((row, index) => (
              <tr key={String(row.id || index)}>
                {columns.map((column) => <td key={column}>{String(row[column] ?? row[column.toLowerCase().replaceAll(' ', '_')] ?? '-')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
