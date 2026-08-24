import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
  Upload,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import {
  Authority,
  buildAnalysisPrompt,
  calculateReadiness,
  documentKeys,
  documentLabels,
  DocumentKey,
} from './readiness';

const initialDocuments = Object.fromEntries(
  documentKeys.map((key) => [key, false]),
) as Record<DocumentKey, boolean>;

export default function HealthcareReadiness() {
  const navigate = useNavigate();
  const [authority, setAuthority] = useState<Authority>('unsure');
  const [documents, setDocuments] = useState(initialDocuments);
  const result = useMemo(
    () => calculateReadiness({ authority, documents }),
    [authority, documents],
  );

  const startReview = () => {
    const prompt = buildAnalysisPrompt(authority, result.missing);
    navigate('/c/new', { state: { healthcarePrompt: prompt } });
  };

  return (
    <main className="min-h-full bg-slate-50 px-5 py-8 text-slate-900 md:px-10 lg:px-14 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] bg-emerald-950 p-7 text-white shadow-xl shadow-emerald-950/10 md:p-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-emerald-300 uppercase">
            <ShieldCheck className="size-4" /> Prometric Edge AI
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
                Healthcare licensing document readiness
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/75">
                Organise evidence before paying for verification or accepting a
                job offer. Then ask AI to review the documents with source
                citations.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="flex items-end justify-between">
                <span className="text-sm text-emerald-100">
                  Preparation score
                </span>
                <strong className="text-4xl">{result.percent}%</strong>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-emerald-300 transition-all"
                  style={{ width: `${result.percent}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-emerald-100/70">
                {result.present} of {result.total} document groups marked ready
                · {result.status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="size-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold">Your route</h2>
                <p className="text-sm text-slate-500">
                  Choose the intended authority.
                </p>
              </div>
            </div>
            <label
              className="mt-6 block text-sm font-medium"
              htmlFor="authority"
            >
              Authority or work location
            </label>
            <select
              id="authority"
              value={authority}
              onChange={(event) =>
                setAuthority(event.target.value as Authority)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm dark:border-slate-700"
            >
              <option value="unsure">Not sure yet</option>
              <option value="dha">Dubai — DHA</option>
              <option value="doh">Abu Dhabi — DoH</option>
              <option value="mohap">Northern Emirates — MOHAP</option>
            </select>
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4" /> Important
              </div>
              This score measures document preparation only. It is not an
              eligibility decision, registration, licence, or permission to
              practise.
            </div>
            <Button
              type="button"
              onClick={startReview}
              className="mt-6 w-full rounded-xl bg-emerald-700 py-6 hover:bg-emerald-800"
            >
              <FileSearch className="size-4" /> Start cited AI review
              <ArrowRight className="ml-auto size-4" />
            </Button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Document checklist</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mark what you have. Upload the actual files in the AI review.
                </p>
              </div>
              <Upload className="size-6 text-emerald-600" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {documentKeys.map((key) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                    documents[key]
                      ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                      : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={documents[key]}
                    onChange={(event) =>
                      setDocuments((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                    className="mt-1 size-4 accent-emerald-700"
                  />
                  <span className="text-sm leading-6">
                    {documentLabels[key]}
                  </span>
                  {documents[key] && (
                    <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-600" />
                  )}
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              'Missing evidence',
              'Identify gaps before verification or an employer request.',
            ],
            [
              'Consistency review',
              'Compare names, dates, titles and experience periods across files.',
            ],
            [
              'Cited action plan',
              'Separate document facts from general licensing guidance.',
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
