export type Authority = 'dha' | 'doh' | 'mohap' | 'unsure';

export type DocumentKey =
  | 'qualification'
  | 'transcript'
  | 'registration'
  | 'experience'
  | 'goodStanding'
  | 'identity'
  | 'dataflow'
  | 'eligibility';

export interface ReadinessInput {
  authority: Authority;
  documents: Record<DocumentKey, boolean>;
}

export interface ReadinessResult {
  percent: number;
  present: number;
  total: number;
  missing: DocumentKey[];
  status: 'Starting' | 'In progress' | 'Ready for detailed review';
}

export const documentLabels: Record<DocumentKey, string> = {
  qualification: 'Professional qualification or degree',
  transcript: 'Academic transcript',
  registration: 'Professional registration from country of practice',
  experience: 'Experience certificates',
  goodStanding: 'Good-standing certificate',
  identity: 'Passport or identity document',
  dataflow: 'Primary-source verification / DataFlow report',
  eligibility: 'Authority registration, eligibility or licence letter',
};

export const documentKeys = Object.keys(documentLabels) as DocumentKey[];

export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const missing = documentKeys.filter((key) => !input.documents[key]);
  const present = documentKeys.length - missing.length;
  const percent = Math.round((present / documentKeys.length) * 100);
  const status =
    percent >= 75
      ? 'Ready for detailed review'
      : percent >= 25
        ? 'In progress'
        : 'Starting';

  return { percent, present, total: documentKeys.length, missing, status };
}

export function buildAnalysisPrompt(
  authority: Authority,
  missing: DocumentKey[],
): string {
  const authorityName = {
    dha: 'DHA (Dubai)',
    doh: 'DoH (Abu Dhabi)',
    mohap: 'MOHAP',
    unsure: 'the appropriate UAE healthcare authority',
  }[authority];
  const missingText = missing.length
    ? missing.map((key) => documentLabels[key]).join(', ')
    : 'No checklist items are currently marked missing';

  return `Review my uploaded healthcare licensing documents for ${authorityName}. My checklist currently shows: ${missingText}. Identify missing evidence, inconsistent names or dates, possible expiry issues, unclear experience periods, and questions I should verify with the authority or employer. Separate facts found in my documents from general guidance, cite the uploaded source for every document-specific statement, and do not claim that I am officially eligible or licensed.`;
}
