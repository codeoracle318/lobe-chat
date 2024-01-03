import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatListActionsBar {
  copy: ActionIconGroupItems;
  del: ActionIconGroupItems;
  delAndRegenerate: ActionIconGroupItems;
  divider: { type: 'divider' };
  edit: ActionIconGroupItems;
  regenerate: ActionIconGroupItems;
}

export const useChatListActionsBar = (): ChatListActionsBar => {
  const { t } = useTranslation('common');

  return {
    copy: {
      icon: Copy,
      key: 'copy',
      label: t('copy', { defaultValue: 'Copy' }),
    },
    del: {
      icon: Trash,
      key: 'del',
      label: t('delete', { defaultValue: 'Delete' }),
    },
    delAndRegenerate: {
      icon: RotateCw,
      key: 'delAndRegenerate',
      label: t('messageAction.delAndRegenerate', {
        defaultValue: 'Delete and regenerate',
        ns: 'chat',
      }),
    },
    divider: {
      type: 'divider',
    },
    edit: {
      icon: Edit,
      key: 'edit',
      label: t('edit', { defaultValue: 'Edit' }),
    },
    regenerate: {
      icon: RotateCw,
      key: 'regenerate',
      label: t('regenerate', { defaultValue: 'Regenerate' }),
    },
  };
};
