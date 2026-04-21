"use client";

import { Mail, Phone, MapPin } from "lucide-react";

function ContactCard({
  icon: Icon,
  title,
  primary,
  secondary,
}: {
  icon: typeof Mail;
  title: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="rounded-2xl border border-accent-20 bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100/10">
          <Icon className="h-6 w-6 text-primary-100" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-unageo text-lg font-semibold text-secondary-000">
            {title}
          </h3>
          <p className="mt-1 font-unageo text-base text-accent-80">{primary}</p>
          <p className="mt-1 font-unageo text-sm text-accent-60">{secondary}</p>
        </div>
      </div>
    </div>
  );
}

export function ContactInfoPanel() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <ContactCard
        icon={Mail}
        title="Email support"
        primary="support@afrivendor.com"
        secondary="We usually respond within 24 hours"
      />
      <ContactCard
        icon={Phone}
        title="Phone support"
        primary="+44 20 1234 5678"
        secondary="Mon–Fri, 9am–6pm GMT"
      />
      <ContactCard
        icon={MapPin}
        title="Office"
        primary="London, United Kingdom"
        secondary="Visits by appointment only"
      />
    </div>
  );
}
