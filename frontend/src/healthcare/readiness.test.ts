import { describe, expect, it } from 'vitest';

import { buildAnalysisPrompt, calculateReadiness } from './readiness';

const emptyDocuments = {
  qualification: false,
  transcript: false,
  registration: false,
  experience: false,
  goodStanding: false,
  identity: false,
  dataflow: false,
  eligibility: false,
};

describe('healthcare document readiness', () => {
  it('calculates a transparent checklist score', () => {
    const result = calculateReadiness({
      authority: 'dha',
      documents: { ...emptyDocuments, qualification: true, identity: true },
    });

    expect(result.percent).toBe(25);
    expect(result.present).toBe(2);
    expect(result.missing).toContain('goodStanding');
    expect(result.status).toBe('In progress');
  });

  it('builds a cautious, authority-specific analysis request', () => {
    const prompt = buildAnalysisPrompt('doh', ['experience']);

    expect(prompt).toContain('DoH (Abu Dhabi)');
    expect(prompt).toContain('Experience certificates');
    expect(prompt).toContain('do not claim that I am officially eligible');
  });
});
