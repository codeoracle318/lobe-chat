import { PluginErrorType } from '@lobehub/chat-plugin-sdk';

import { ChatErrorType } from '@/types/fetch';

export default {
  response: {
    400: '很抱歉，服务器不明白您的请求，请确认您的请求参数是否正确',
    401: '很抱歉，服务器拒绝了您的请求，可能是因为您的权限不足或未提供有效的身份验证',
    403: '很抱歉，服务器拒绝了您的请求，您没有访问此内容的权限 ',
    404: '很抱歉，服务器找不到您请求的页面或资源，请确认您的 URL 是否正确',
    405: '很抱歉，服务器不支持您使用的请求方法，请确认您的请求方法是否正确',
    429: '很抱歉，您的请求太多，服务器有点累了，请稍后再试',
    500: '很抱歉，服务器似乎遇到了一些困难，暂时无法完成您的请求，请稍后再试',
    502: '很抱歉，服务器似乎迷失了方向，暂时无法提供服务，请稍后再试',
    503: '很抱歉，服务器当前无法处理您的请求，可能是由于过载或正在进行维护，请稍后再试',
    504: '很抱歉，服务器没有等到上游服务器的回应，请稍后再试',

    [PluginErrorType.PluginMarketIndexNotFound]:
      '很抱歉，服务器没有找到插件索引，请检查索引地址是否正确',
    [PluginErrorType.PluginMarketIndexInvalid]:
      '很抱歉，插件索引校验未通过，请检查索引文件格式是否规范',
    [PluginErrorType.PluginMetaNotFound]:
      '很抱歉，没有在索引中发现该插件，请插件在索引中的配置信息',
    [PluginErrorType.PluginMetaInvalid]:
      '很抱歉，该插件的元信息校验未通过，请检查插件元信息格式是否规范',
    [PluginErrorType.PluginManifestNotFound]:
      '很抱歉，服务器没有找到该插件的描述清单 (manifest.json)，请检查插件描述文件地址是否正确',
    [PluginErrorType.PluginManifestInvalid]:
      '很抱歉，该插件的描述清单校验未通过，请检查描述清单格式是否规范',
    [PluginErrorType.PluginApiNotFound]:
      '很抱歉，插件描述清单中不存在该 API ，请检查你的请求方法与插件清单 API 是否匹配',
    [PluginErrorType.PluginApiParamsError]:
      '很抱歉，该插件请求的入参校验未通过，请检查入参与 Api 描述信息是否匹配',
    [PluginErrorType.PluginSettingsInvalid]:
      '很抱歉，该插件需要进行配置后才可以使用，请检查你的配置是否正确',

    [ChatErrorType.InvalidAccessCode]:
      '密码不正确或为空，请输入正确的访问密码，或者添加自定义 OpenAI API Key',
    [ChatErrorType.OpenAIBizError]: '请求 OpenAI 服务出错，请根据以下信息排查或重试',
  },
  unlock: {
    apikey: {
      description: '输入你的 OpenAI API Key 即可绕过密码验证。应用不会记录你的 API Key',
      title: '使用自定义 API Key',
    },
    confirm: '确认并重试',
    password: {
      description: '管理员已开启应用加密，输入应用密码后即可解锁应用。密码只需填写一次',
      title: '输入密码解锁应用',
    },
  },
};
