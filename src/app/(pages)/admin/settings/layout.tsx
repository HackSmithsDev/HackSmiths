import { Settings } from 'lucide-react';
import AdminSettingsSideNav from '@/components/unit/AdminSettingsSideNav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-6xl">
      <div>
        <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" />
          System Matrix Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          Configure operational thresholds, security windows, SMTP gateways, and public entry points.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <AdminSettingsSideNav />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}