export function formatDate(iso?: string) {
if (!iso) return ''
const d = new Date(iso)
return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}