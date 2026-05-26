import { UserPlus } from 'lucide-react';

import { QuickAddForm } from '@/components/shared/QuickAddForm';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useAppStore } from '@/store/useAppStore';

export function RosterQuickAdd() {
  const { t } = useTranslation();
  const addPerson = useAppStore((state) => state.addPerson);

  return (
    <QuickAddForm
      fieldName="performerName"
      label={t('roster.performerName')}
      maxLength={INPUT_LIMITS.maxPersonNameLength}
      requiredMessage={t('roster.performerNameRequired')}
      announceKey="a11y.addedPerformer"
      onAdd={addPerson}
      addIcon={UserPlus}
    />
  );
}
