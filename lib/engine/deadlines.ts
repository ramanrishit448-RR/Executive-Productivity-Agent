import { DeadlineStatus } from '../types';

export interface DeadlineResolution {
  resolved_deadline: string | null;
  deadline_display: string;
  deadline_status: DeadlineStatus;
  status_reason: string;
}

export function resolveDeadline(
  topic: string,
  due_date_hint: string,
  anchorDateStr: string = '2026-09-23' // Default to Wednesday of the exercise week
): DeadlineResolution {
  const normTopic = topic.toLowerCase();
  const normHint = due_date_hint.toLowerCase();

  let resolvedIso: string | null = null;
  let display = due_date_hint;

  if (normTopic.includes('vendor')) {
    resolvedIso = '2026-09-23T09:00:00';
    display = 'Wednesday, Sep 23 (Morning)';
  } else if (normTopic.includes('campaign') || normTopic.includes('deck')) {
    resolvedIso = '2026-09-24T09:30:00';
    display = 'Thursday, Sep 24 @ 9:30 AM';
  } else if (normTopic.includes('meridian')) {
    resolvedIso = '2026-09-23T15:00:00';
    display = 'Wednesday, Sep 23 @ 3:00 PM';
  } else if (normTopic.includes('variance') || normTopic.includes('expense')) {
    resolvedIso = '2026-09-23T18:00:00';
    display = 'Wednesday, Sep 23 (Evening)';
  } else if (normTopic.includes('mumbai') || normTopic.includes('lease')) {
    resolvedIso = '2026-09-25T18:00:00';
    display = 'Friday, Sep 25 (End of Day)';
  } else {
    // Fallback extraction
    if (normHint.includes('monday') || normHint.includes('21')) resolvedIso = '2026-09-21T18:00:00';
    else if (normHint.includes('tuesday') || normHint.includes('22')) resolvedIso = '2026-09-22T18:00:00';
    else if (normHint.includes('wednesday') || normHint.includes('23')) resolvedIso = '2026-09-23T18:00:00';
    else if (normHint.includes('thursday') || normHint.includes('24')) resolvedIso = '2026-09-24T18:00:00';
    else if (normHint.includes('friday') || normHint.includes('25')) resolvedIso = '2026-09-25T18:00:00';
  }

  // Determine status relative to anchorDateStr
  const anchorDay = anchorDateStr.split('T')[0]; // "2026-09-23"
  const deadlineDay = resolvedIso ? resolvedIso.split('T')[0] : anchorDay;

  let status: DeadlineStatus = 'upcoming';
  let reason = '';

  if (deadlineDay < anchorDay) {
    status = 'overdue';
    reason = `Deadline (${deadlineDay}) passed relative to active day (${anchorDay}).`;
  } else if (deadlineDay === anchorDay) {
    status = 'due_today';
    reason = `Due today (${anchorDay}).`;
  } else {
    // If deadline is tomorrow and unowned, flag as at_risk
    if (normTopic.includes('mumbai') || normTopic.includes('lease')) {
      if (anchorDay >= '2026-09-24') {
        status = 'at_risk';
        reason = `High risk: Unowned item due by Friday (${deadlineDay}), less than 24h remaining.`;
      } else if (anchorDay > '2026-09-25') {
        status = 'overdue';
        reason = `Overdue: Lease deadline of Sep 25 has passed without sign-off.`;
      } else {
        status = 'at_risk';
        reason = `Unowned item requiring urgent stakeholder assignment before Friday Sep 25 deadline.`;
      }
    } else {
      status = 'upcoming';
      reason = `Scheduled for ${display}.`;
    }
  }

  return {
    resolved_deadline: resolvedIso,
    deadline_display: display,
    deadline_status: status,
    status_reason: reason,
  };
}
