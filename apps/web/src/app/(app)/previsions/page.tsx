import { can } from "@cashpilot/application";
import { ForecastChart } from "@/components/forecast/forecast-chart";
import { FlowList, HorizonTable, ShortageList } from "@/components/forecast/forecast-summary";
import { ScenarioForm } from "@/components/forecast/scenario-form";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { PageHeader } from "@/components/ui/page-header";
import { useCases } from "@/container";
import { getCurrentUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/format-money";
import { readScenario } from "./scenario";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ForecastPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!can(user.role, "treasury:view")) return <AccessDenied />;

  const { scenario, params, isValid } = readScenario(await searchParams);
  const forecast = await useCases.getForecast.execute(user, scenario);

  return (
    <>
      <PageHeader
        title="Prévisions"
        description={`Solde réel de départ : ${formatMoney(forecast.startBalance)}, plus les encaissements et dépenses attendus.`}
      />

      <Card title="Solde prévu sur 90 jours">
        <ForecastChart base={forecast.base.points} simulated={forecast.simulated?.points ?? null} />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="À 30, 60 et 90 jours">
          <HorizonTable base={forecast.base} simulated={forecast.simulated} />
        </Card>
        <Card title="Manques de liquidités">
          <div className="flex flex-col gap-4">
            <ShortageList title="Prévision" shortages={forecast.base.shortages} />
            {forecast.simulated && <ShortageList title="Simulation" shortages={forecast.simulated.shortages} />}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Simulation « What if? »">
          {!isValid && <FormMessage message="Certaines hypothèses sont invalides et ont été ignorées." />}
          <ScenarioForm invoices={forecast.invoices} params={params} />
        </Card>
        <Card title="Flux pris en compte">
          <FlowList flows={forecast.flows} />
        </Card>
      </div>
    </>
  );
}
