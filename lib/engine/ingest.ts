import sourcePack from '@/data/source-pack.json';
import { SourceItem } from '../types';

export function ingestSourcePack(customData?: any): SourceItem[] {
  const data = customData || sourcePack;
  const items: SourceItem[] = [];

  // 1. Ingest Meeting Transcripts
  if (Array.isArray(data.meeting_transcripts)) {
    for (const mt of data.meeting_transcripts) {
      mt.lines.forEach((line: { speaker: string; text: string }, idx: number) => {
        // Approximate time within the meeting interval (e.g. 09:00 - 09:35)
        const minuteOffset = Math.min(34, idx * 3);
        const paddedMin = String(minuteOffset).padStart(2, '0');
        const timestamp = `${mt.date}T09:${paddedMin}:00`;

        items.push({
          source_type: 'transcript',
          source_id: `${mt.source_id}-line-${idx + 1}`,
          timestamp,
          title: `${mt.title} (Line ${idx + 1})`,
          speaker_or_sender: line.speaker,
          recipient: 'Meeting Attendees (All)',
          raw_text: line.text,
          metadata: {
            meeting_id: mt.source_id,
            meeting_title: mt.title,
            attendees: mt.attendees,
            line_index: idx + 1,
          },
        });
      });
    }
  }

  // 2. Ingest Calendars
  if (data.calendars) {
    for (const [owner, events] of Object.entries(data.calendars)) {
      if (Array.isArray(events)) {
        events.forEach((evt: any, idx: number) => {
          const isBlocked = evt.event.toLowerCase() === 'blocked';
          const [startHour] = evt.time.split('-')[0].split(':');
          const [startMin] = evt.time.split('-')[0].split(':').slice(1);
          const timestamp = `${evt.date}T${startHour.padStart(2, '0')}:${startMin.padStart(2, '0')}:00`;

          items.push({
            source_type: 'calendar',
            source_id: `cal-${owner.toLowerCase().replace(/\s+/g, '-')}-${evt.date}-${idx + 1}`,
            timestamp,
            title: `Calendar Hold: ${owner} - ${evt.event}`,
            speaker_or_sender: owner,
            recipient: owner,
            raw_text: evt.event,
            metadata: {
              calendar_owner: owner,
              time_range: evt.time,
              is_informative: !isBlocked,
            },
          });
        });
      }
    }
  }

  // 3. Ingest Email Threads
  if (Array.isArray(data.email_threads)) {
    for (const thread of data.email_threads) {
      for (const email of thread.emails) {
        items.push({
          source_type: 'email',
          source_id: email.source_id,
          timestamp: email.datetime,
          title: `Email: ${thread.subject}`,
          speaker_or_sender: email.from,
          recipient: email.to,
          raw_text: email.body,
          thread_id: thread.thread_id,
          metadata: {
            subject: thread.subject,
          },
        });
      }
    }
  }

  // 4. Ingest Voice Notes
  if (Array.isArray(data.voice_notes)) {
    for (const vn of data.voice_notes) {
      items.push({
        source_type: 'voice_note',
        source_id: vn.source_id,
        timestamp: vn.datetime,
        title: `Voice Note (${vn.context || 'Audio Memo'})`,
        speaker_or_sender: vn.speaker,
        recipient: 'Self (Arjun Malhotra)',
        raw_text: vn.text,
        metadata: {
          note: vn.note,
          context: vn.context,
        },
      });
    }
  }

  // Sort chronological
  return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
