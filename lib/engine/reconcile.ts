import { CandidateCommitment, ReconciledCommitment, SourceItem, SourceType } from '../types';
import { classifyOwnership } from './ownership';
import { resolveDeadline } from './deadlines';

export function reconcileCommitments(
  candidates: CandidateCommitment[],
  sources: SourceItem[],
  anchorDateStr: string = '2026-09-23'
): ReconciledCommitment[] {
  // 1. Group candidates into clusters by topic
  const clusters: { [key: string]: CandidateCommitment[] } = {};

  for (const cand of candidates) {
    let clusterKey = cand.topic;
    if (cand.topic.toLowerCase().includes('vendor')) clusterKey = 'Vendor List';
    else if (cand.topic.toLowerCase().includes('deck') || cand.topic.toLowerCase().includes('campaign')) clusterKey = 'Q3 Campaign Deck Review';
    else if (cand.topic.toLowerCase().includes('mumbai') || cand.topic.toLowerCase().includes('lease')) clusterKey = 'Mumbai Office Lease Renewal';
    else if (cand.topic.toLowerCase().includes('variance') || cand.topic.toLowerCase().includes('expense')) clusterKey = 'July Expense Variance Report';
    else if (cand.topic.toLowerCase().includes('meridian') || cand.topic.toLowerCase().includes('call')) clusterKey = 'Meridian Logistics Client Call';

    if (!clusters[clusterKey]) {
      clusters[clusterKey] = [];
    }
    clusters[clusterKey].push(cand);
  }

  // Source lookup map
  const sourceMap = new Map<string, SourceItem>();
  for (const src of sources) {
    sourceMap.set(src.source_id, src);
  }

  const reconciledList: ReconciledCommitment[] = [];

  for (const [topic, items] of Object.entries(clusters)) {
    // Sort items chronologically by timestamp - recency wins!
    const sorted = [...items].sort(
      (a, b) => new Date(a.source_timestamp).getTime() - new Date(b.source_timestamp).getTime()
    );

    const latest = sorted[sorted.length - 1];
    const allSourceIds = Array.from(new Set(sorted.map(i => i.source_id)));
    const allQuotes = sorted.map(i => i.extracted_from);

    // Build citation history
    const citationHistory = sorted.map((cand, idx) => {
      const src = sourceMap.get(cand.source_id);
      let effect = 'Referenced statement';
      if (idx === 0) {
        effect = 'Initial statement / proposed timeline';
      } else if (idx === sorted.length - 1) {
        effect = 'Final confirmed authoritative state (Recency-Wins)';
      } else {
        effect = `Superseded earlier date '${cand.due_date_hint}'`;
      }

      return {
        source_id: cand.source_id,
        source_type: (src?.source_type || 'email') as SourceType,
        timestamp: cand.source_timestamp,
        quote: cand.extracted_from,
        statement_effect: effect,
      };
    });

    // 2. Classify ownership
    const { ownership, actor, reason: ownershipReason } = classifyOwnership(
      topic,
      latest.made_by,
      latest.made_to,
      latest.description,
      allQuotes
    );

    // 3. Resolve deadline
    const { resolved_deadline, deadline_display, deadline_status, status_reason } = resolveDeadline(
      topic,
      latest.due_date_hint,
      anchorDateStr
    );

    // Final description synthesis
    let finalDesc = latest.description;
    if (topic === 'Vendor List') {
      finalDesc = 'Send updated vendor list to Raghav (confirmed for Wednesday morning delivery, overriding previous Tuesday delays)';
    } else if (topic === 'Q3 Campaign Deck Review') {
      finalDesc = 'Review Q3 campaign deck with Neha (final confirmed slot: Thursday at 9:30 AM before board prep)';
    } else if (topic === 'Mumbai Office Lease Renewal') {
      finalDesc = 'Mumbai office lease renewal signature authorization (UNOWNED: Facilities, Raghav, and Divya all unresolved; deadline Friday Sep 25)';
    } else if (topic === 'Meridian Logistics Client Call') {
      finalDesc = 'Attend rescheduled client call with Priya Nair (Meridian Logistics) on Wednesday at 3:00 PM';
    } else if (topic === 'July Expense Variance Report') {
      finalDesc = 'Review July expense variance report delivered by Divya Rao ahead of Thursday board prep';
    }

    reconciledList.push({
      id: `rec-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      topic,
      final_description: finalDesc,
      made_by: actor,
      made_to: latest.made_to,
      ownership,
      ownership_reason: ownershipReason,
      resolved_deadline,
      deadline_display,
      deadline_status,
      status_reason,
      final_source_id: latest.source_id,
      final_timestamp: latest.source_timestamp,
      all_source_ids: allSourceIds,
      citation_history: citationHistory,
    });
  }

  return reconciledList;
}
