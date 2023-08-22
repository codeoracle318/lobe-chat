import {
  LobeChatPlugin,
  LobeChatPluginsMarketIndex,
  pluginManifestSchema,
} from '@lobehub/chat-plugin-sdk';
import { message } from 'antd';
import { produce } from 'immer';
import { uniq } from 'lodash-es';
import useSWR, { SWRResponse } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { getPluginList } from '@/services/plugin';
import { setNamespace } from '@/utils/storeDebug';

import { SessionStore } from '../../store';
import { sessionSelectors } from '../session/selectors';
import { PluginDispatch, pluginManifestReducer } from './reducers/manifest';

const t = setNamespace('plugin');

/**
 * 代理行为接口
 */
export interface PluginAction {
  checkLocalEnabledPlugins: () => void;
  dispatchPluginManifest: (payload: PluginDispatch) => void;
  fetchPluginManifest: (name: string) => Promise<void>;
  toggleAgentPlugin: (pluginId: string, checked: boolean) => void;
  updateManifestLoadingState: (key: string, value: boolean | undefined) => void;
  useFetchPluginList: () => SWRResponse<LobeChatPluginsMarketIndex>;
}

export const createPluginSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  PluginAction
> = (set, get) => ({
  checkLocalEnabledPlugins: async () => {
    const { sessions, fetchPluginManifest } = get();

    let enabledPlugins: string[] = [];

    for (const session of Object.values(sessions)) {
      const plugins = session.config.plugins;
      if (!plugins || plugins.length === 0) continue;

      enabledPlugins = [...enabledPlugins, ...plugins];
    }

    const plugins = uniq(enabledPlugins);

    await Promise.all(plugins.map((name) => fetchPluginManifest(name)));

    console.log('fetched');
    set({ manifestPrepared: true }, false, t('checkLocalEnabledPlugins'));
  },
  dispatchPluginManifest: (payload) => {
    const { pluginManifestMap } = get();
    const nextManifest = pluginManifestReducer(pluginManifestMap, payload);

    set({ pluginManifestMap: nextManifest }, false, t('dispatchPluginManifest', payload));
  },

  fetchPluginManifest: async (name) => {
    const plugin = get().pluginList.find((plugin) => plugin.name === name);
    // 1. 校验文件

    if (!plugin) return;

    if (!plugin.manifest) {
      message.error('插件未配置 描述文件');
      return;
    }

    // 2. 发送请求
    get().updateManifestLoadingState(name, true);
    let data: LobeChatPlugin | null;

    try {
      const res = await fetch(plugin.manifest);

      data = await res.json();
    } catch (error) {
      data = null;
      console.error(error);
    }

    get().updateManifestLoadingState(name, undefined);
    if (!data) {
      message.error('插件描述文件请求失败');
      return;
    }

    // 3. 校验插件文件格式规范
    const { success } = pluginManifestSchema.safeParse(data);

    if (!success) {
      message.error('插件描述文件格式错误');
      return;
    }

    // 4. 存储 manifest 信息
    get().dispatchPluginManifest({ id: plugin.name, plugin: data, type: 'addManifest' });
  },

  toggleAgentPlugin: async (id: string, checked) => {
    const { activeId, fetchPluginManifest } = get();
    const session = sessionSelectors.currentSession(get());
    if (!activeId || !session) return;

    console.log(checked);

    if (checked) {
      await fetchPluginManifest(id);
    }

    const config = produce(session.config, (draft) => {
      if (draft.plugins === undefined) {
        draft.plugins = [id];
      } else {
        const plugins = draft.plugins;
        if (plugins.includes(id)) {
          plugins.splice(plugins.indexOf(id), 1);
        } else {
          plugins.push(id);
        }
      }
    });

    get().dispatchSession({ config, id: activeId, type: 'updateSessionConfig' });
  },
  updateManifestLoadingState: (key, value) => {
    set(
      produce((draft) => {
        draft.pluginManifestLoading[key] = value;
      }),
      false,
      t('updateManifestLoadingState'),
    );
  },
  useFetchPluginList: () =>
    useSWR<LobeChatPluginsMarketIndex>('fetchPluginList', getPluginList, {
      onSuccess: (pluginMarketIndex) => {
        set({ pluginList: pluginMarketIndex.plugins }, false, t('useFetchPluginList'));
      },
    }),
});
