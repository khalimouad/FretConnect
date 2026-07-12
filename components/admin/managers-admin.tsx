"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Manager } from "@/lib/domain/types";
import { companies, managers as seedManagers } from "@/lib/data/mock";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { ShieldIcon } from "@/components/icons";

/** Admin §3.1: create, suspend or delete Manager accounts. */
export function ManagersAdmin({ dict }: { dict: Dictionary }) {
  const [managers, setManagers] = useState<Manager[]>(seedManagers);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function addManager(e: React.FormEvent) {
    e.preventDefault();
    setManagers((prev) => [
      ...prev,
      { id: `mgr-${Date.now()}`, name, email, active: true },
    ]);
    setName("");
    setEmail("");
    setShowForm(false);
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          + {dict.adminDash.addManager}
        </Button>
      </div>

      {showForm ? (
        <Card className="mt-4 p-5">
          <form onSubmit={addManager} className="grid items-end gap-4 sm:grid-cols-3">
            <Field label={dict.auth.fullName}>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={dict.common.email}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Button type="submit">{dict.common.save}</Button>
          </form>
        </Card>
      ) : null}

      <div className="mt-4 space-y-3">
        {managers.map((m) => {
          const portfolio = companies.filter((c) => c.managerId === m.id).length;
          return (
            <Card
              key={m.id}
              className={`flex flex-wrap items-center justify-between gap-4 p-5 ${
                m.active ? "" : "opacity-60"
              }`}
            >
              <div>
                <p className="flex items-center gap-2 font-semibold text-brand-950">
                  <ShieldIcon
                    width={16}
                    height={16}
                    className={m.active ? "text-emerald-600" : "text-slate-300"}
                  />
                  {m.name}
                  {!m.active ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 ring-1 ring-inset ring-red-200">
                      {dict.status.suspended}
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-sm text-slate-400">{m.email}</p>
              </div>
              <div className="flex items-center gap-5">
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-brand-950">{portfolio}</span>{" "}
                  {dict.adminDash.companiesCount}
                </p>
                <div className="flex gap-2">
                  {m.active ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setManagers((prev) =>
                          prev.map((x) => (x.id === m.id ? { ...x, active: false } : x)),
                        )
                      }
                    >
                      {dict.managerDash.suspend}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() =>
                        setManagers((prev) =>
                          prev.map((x) => (x.id === m.id ? { ...x, active: true } : x)),
                        )
                      }
                    >
                      {dict.managerDash.reactivate}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={portfolio > 0}
                    title={portfolio > 0 ? `${portfolio} ${dict.adminDash.companiesCount}` : undefined}
                    onClick={() =>
                      setManagers((prev) => prev.filter((x) => x.id !== m.id))
                    }
                  >
                    {dict.companyDash.delete}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
