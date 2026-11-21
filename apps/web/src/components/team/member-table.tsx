import { ROLE_LABELS, type MemberView } from "@cashpilot/application";
import { Badge } from "@/components/ui/badge";

export function MemberTable({ members }: { members: MemberView[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm whitespace-nowrap">
        <thead className="border-b border-slate-200 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-4 py-3 font-medium">{member.name}</td>
              <td className="px-4 py-3 text-slate-500">{member.email}</td>
              <td className="px-4 py-3">
                <Badge tone={member.role === "OWNER" ? "success" : "neutral"}>{ROLE_LABELS[member.role]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
