import type { ClientView } from "@cashpilot/application";
import Link from "next/link";

/** basePath : « /clients » ou « /fournisseurs », pour le lien vers la fiche. */
export function ClientTable({ clients, basePath }: { clients: ClientView[]; basePath: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Téléphone</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">
                <Link href={`${basePath}/${client.id}`} className="text-brand-700 hover:underline">
                  {client.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-500">{client.email ?? "—"}</td>
              <td className="px-4 py-3 text-slate-500">{client.phone ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
