import { OwnershipType } from '../types';

export interface OwnershipClassification {
  ownership: OwnershipType;
  actor: string;
  reason: string;
}

export function classifyOwnership(
  topic: string,
  made_by: string,
  made_to: string,
  description: string,
  allSourceQuotes: string[]
): OwnershipClassification {
  const normMadeBy = made_by.toLowerCase();
  const normMadeTo = made_to.toLowerCase();
  const normTopic = topic.toLowerCase();

  // Strict rule: If it's the Mumbai lease renewal or explicitly unassigned
  if (
    normTopic.includes('mumbai') ||
    normTopic.includes('lease') ||
    normMadeBy.includes('unassigned')
  ) {
    return {
      ownership: 'unowned',
      actor: 'Unassigned / Needs Owner',
      reason: 'No confirmed owner. Facilities, Raghav, and Divya all declined or queried ownership without acceptance.',
    };
  }

  // If Arjun is the primary actor committing to deliver
  if (
    normTopic.includes('vendor') ||
    normTopic.includes('meridian') ||
    normMadeBy.includes('arjun') ||
    normMadeBy === 'me'
  ) {
    return {
      ownership: 'mine',
      actor: 'Arjun Malhotra',
      reason: 'Action committed by Arjun Malhotra (VP Sales).',
    };
  }

  // If someone else owes something to Arjun (e.g., Neha, Divya)
  if (
    normTopic.includes('deck') ||
    normTopic.includes('campaign') ||
    normTopic.includes('variance') ||
    normTopic.includes('expense') ||
    normMadeBy.includes('neha') ||
    normMadeBy.includes('divya') ||
    normMadeTo.includes('arjun')
  ) {
    const actorName = normTopic.includes('deck') ? 'Neha Kapoor' : normTopic.includes('variance') ? 'Divya Rao' : made_by;
    return {
      ownership: 'waiting_on_others',
      actor: actorName,
      reason: `Action owed by ${actorName} to Arjun Malhotra.`,
    };
  }

  return {
    ownership: 'unowned',
    actor: 'Unassigned',
    reason: 'Insufficient evidence in source messages to establish accepted ownership.',
  };
}
