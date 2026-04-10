import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PATIENTS } from '@/data/patient-seed';
import { MODULE_DEFINITIONS, MODULE_MAP } from '@/services/module-definitions';
import { AnalysisResult, ModuleExecutionRecord, ModuleFeatureItem, ModuleFeatureStatus, NotificationItem } from '@/types/ai-modules';

const now = () => new Date().toISOString();
const STORAGE_KEYS = {
  executions: 'nusa_onko_rt_executions',
  notifications: 'nusa_onko_rt_notifications',
  moduleFeatures: 'nusa_onko_rt_module_features',
} as const;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const buildDefaultFeatureState = (): ModuleFeatureItem[] => MODULE_DEFINITIONS.flatMap((moduleDef) => moduleDef.features.map((feature) => ({
  id: crypto.randomUUID(),
  moduleKey: moduleDef.key,
  name: feature,
  status: 'active' as const,
  source: 'default' as const,
  updatedAt: now(),
})));

interface Store {
  patients: typeof PATIENTS;
  executions: ModuleExecutionRecord[];
  notifications: NotificationItem[];
  moduleFeatures: ModuleFeatureItem[];
  runModule: (moduleKey: string, input: Record<string, unknown>) => AnalysisResult;
  getPatientExecutions: (patientId: string) => ModuleExecutionRecord[];
  clearExecutions: () => void;
  addModuleFeature: (moduleKey: string, name: string) => void;
  updateModuleFeature: (id: string, updates: Partial<Pick<ModuleFeatureItem, 'status' | 'note' | 'name'>>) => void;
  removeModuleFeature: (id: string) => void;
  resetModuleFeatures: (moduleKey: string) => void;
  clearNotifications: (predicate?: (item: NotificationItem) => boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function RTStoreProvider({ children }: { children: React.ReactNode }) {
  const [executions, setExecutions] = useState<ModuleExecutionRecord[]>(() => safeParse(localStorage.getItem(STORAGE_KEYS.executions), []));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => safeParse(localStorage.getItem(STORAGE_KEYS.notifications), []));
  const [moduleFeatures, setModuleFeatures] = useState<ModuleFeatureItem[]>(() => {
    const stored = safeParse<ModuleFeatureItem[] | null>(localStorage.getItem(STORAGE_KEYS.moduleFeatures), null);
    return stored && stored.length > 0 ? stored : buildDefaultFeatureState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.executions, JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.moduleFeatures, JSON.stringify(moduleFeatures));
  }, [moduleFeatures]);

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

  const addModuleFeature = (moduleKey: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    setModuleFeatures((prev) => [{
      id: crypto.randomUUID(),
      moduleKey,
      name: cleanName,
      status: 'planned',
      source: 'custom',
      updatedAt: now(),
    }, ...prev]);
  };

  const updateModuleFeature = (id: string, updates: Partial<Pick<ModuleFeatureItem, 'status' | 'note' | 'name'>>) => {
    setModuleFeatures((prev) => prev.map((item) => item.id === id ? {
      ...item,
      ...updates,
      name: updates.name?.trim() ? updates.name.trim() : item.name,
      updatedAt: now(),
    } : item));
  };

  const removeModuleFeature = (id: string) => {
    setModuleFeatures((prev) => prev.filter((item) => item.id !== id));
  };

  const resetModuleFeatures = (moduleKey: string) => {
    setModuleFeatures((prev) => {
      const kept = prev.filter((item) => item.moduleKey !== moduleKey);
      const defaults = MODULE_MAP[moduleKey].features.map((feature) => ({
        id: crypto.randomUUID(),
        moduleKey,
        name: feature,
        status: 'active' as const,
        source: 'default' as const,
        updatedAt: now(),
      }));
      return [...defaults, ...kept];
    });
  };

  const clearNotifications = (predicate?: (item: NotificationItem) => boolean) => {
    setNotifications((prev) => predicate ? prev.filter((item) => !predicate(item)) : []);
  };

  const value = useMemo(() => ({
    patients: PATIENTS,
    executions,
    notifications,
    moduleFeatures,
    runModule,
    getPatientExecutions: (patientId: string) => executions.filter((e) => e.patientId === patientId),
    clearExecutions: () => setExecutions([]),
    addModuleFeature,
    updateModuleFeature,
    removeModuleFeature,
    resetModuleFeatures,
    clearNotifications,
  }), [executions, notifications, moduleFeatures]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useRTStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('RTStore missing');
  return ctx;
};
