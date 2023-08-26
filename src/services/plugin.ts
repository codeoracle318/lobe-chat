import { PluginRequestPayload } from '@lobehub/chat-plugin-sdk';

import { LOBE_PLUGIN_SETTINGS } from '@/const/fetch';
import { usePluginStore } from '@/store/plugin';
import { getMessageError } from '@/utils/fetch';

import { URLS } from './url';

interface FetchChatModelOptions {
  signal?: AbortSignal | undefined;
  withPlugin?: boolean;
}

/**
 * 请求插件结果´
 */
export const fetchPlugin = async (
  params: PluginRequestPayload,
  options?: FetchChatModelOptions,
) => {
  const settings = usePluginStore.getState().pluginsSettings?.[params.identifier];

  const res = await fetch(URLS.plugins, {
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      [LOBE_PLUGIN_SETTINGS]: JSON.stringify(settings) || '',
    },
    method: 'POST',
    signal: options?.signal,
  });

  if (!res.ok) {
    throw await getMessageError(res);
  }

  return await res.text();
};
