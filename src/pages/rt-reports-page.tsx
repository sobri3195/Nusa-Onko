import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { radiotherapyData } from '@/data/radiotherapy-dummy';

export function RTReportsPage() {
  const byModule = Object.values(radiotherapyData.aiResults.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.moduleName] = (acc[cur.moduleName] ?? 0) + 1;
    return acc;
  }, {}));

  return (
    <AppShell title="Reports & Analytics">
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">AI Module Performance Snapshot</h3>
          <p className="text-sm text-muted-foreground">Total model runs: {radiotherapyData.aiResults.length}</p>
          <p className="text-sm text-muted-foreground">Average runs per module: {(byModule.reduce((a, b) => a + b, 0) / byModule.length).toFixed(1)}</p>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Exports</h3>
          <p className="text-sm text-muted-foreground">Ready for PDF/Excel export endpoint integration (backend report service).</p>
        </Card>
      </div>
      <Card>
        <h3 className="mb-2 font-semibold">Requested Report Categories</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Performa modul AI per site kanker.</li>
          <li>Jumlah alert per kategori severity.</li>
          <li>Tren toksisitas dan adaptive replanning.</li>
          <li>Statistik setup error dan audit dokumen.</li>
          <li>Rekap prioritisasi waiting list.</li>
        </ul>
      </Card>
    </AppShell>
  );
}
