export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-fg mt-1 text-sm">
          Manage your account and connected email providers.
        </p>
      </div>
      {children}
    </div>
  );
}
