'use client';

import { Screen } from '@/components/shared/Screen/Screen';
import { ContentGenerator } from '@/features/generate-content/ContentGenerator/ContentGenerator';

export default function BotPage() {
  return (
    <Screen heading="AI Content Generator">
      <ContentGenerator />
    </Screen>
  );
}
