import { CheckCircle2, PartyPopper } from 'lucide-react';

export function DemoNotice({ text }: { text?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
      <p className="text-xs leading-relaxed text-brand-700">
        {text || 'This is a prototype demonstration. Real device scanning would require a desktop IT agent with appropriate system permissions.'}
      </p>
    </div>
  );
}

export function PartyIcon() {
  return <PartyPopper className="h-5 w-5" />;
}
