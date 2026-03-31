import { createContext, useContext, useMemo, useState } from 'react';
import { PATIENTS } from '@/data/patient-seed';
import { MODULE_MAP } from '@/services/module-definitions';
import { AnalysisResult, ModuleExecutionRecord, NotificationItem } from '@/types/ai-modules';

interface Store {
  patients: typeof PATIENTS;
  executions: ModuleExecutionRecord[];
  notifications: NotificationItem[];
  runModule: (moduleKey: string, input: Record<string, unknown>) => AnalysisResult;
  getPatientExecutions: (patientId: string) => ModuleExecutionRecord[];
}

const Ctx = createContext<Store | null>(null);

export function RTStoreProvider({ children }: { children: React.ReactNode }) {
  const [executions, setExecutions] = useState<ModuleExecutionRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const runModule = (moduleKey: string, input: Record<string, unknown>) => {
    const history = executions.filter((e) => e.moduleKey === moduleKey && e.patientId === input.patientId);
    const result = MODULE_MAP[moduleKey].run(input, history.map((h) => h.result));
    const record: ModuleExecutionRecord = {
      id: crypto.randomUUID(),
      moduleKey,
      patientId: String(input.patientId),
      input,
      result,
    };
    setExecutions((prev) => [record, ...prev]);
    if (['high', 'critical'].includes(result.severity)) {
      setNotifications((prev) => [{
        id: crypto.randomUUID(),
        patientId: String(input.patientId),
        moduleKey,
        severity: result.severity,
        message: `${MODULE_MAP[moduleKey].name}: ${result.summary}`,
        createdAt: result.generatedAt,
      }, ...prev]);
    }
    return result;
  };

  const value = useMemo(() => ({
    patients: PATIENTS,
    executions,
    notifications,
    runModule,
    getPatientExecutions: (patientId: string) => executions.filter((e) => e.patientId === patientId),
  }), [executions, notifications]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRTStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('RTStore missing');
  return ctx;
};
