/*
 * @Author: bugdr
 * @Date: 2022-05-02 14:03:13
 * @LastEditors: bugdr
 * @LastEditTime: 2022-05-19 10:39:05
 * @FilePath: \blog-admin\src\utils\index.ts
 * @Description:
 */
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';
import { message as Message } from 'ant-design-vue';
import { unref } from 'vue';
import { isObject } from '/@/utils/is';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 * ???????????????
 */
export enum ResponseCode {
  SUCCESS = 20000, // ????????????
  LOGIN_SUCCESS = 20001, // ????????????
  JOIN_IN_SUCCESS = 20002, // ????????????
  FAILED = 40000, // ????????????
  GET_RESOURCE_FAILED = 40001, // ??????????????????
  ACCOUNT_NOT_LOGIN = 40002, // ???????????????
  ROLE_TOURIST = 40010, // ????????????
  PERMISSION_DENIED = 40011, // ???????????????
  ACCOUNT_DENIED = 40003, // ???????????????
  ERROR_403 = 40004, // ????????????
  ERROR_404 = 40004, // ????????????
  ERROR_504 = 40004, // ??????????????????????????????
  ERROR_505 = 40004, // ??????????????????????????????????????????
  WAiTING_FOR_SCAN = 40004, // ????????????
  QR_CODE_DEPRECATE = 40004, // ??????????????????
  LOGIN_FAILED = 40004, // ????????????
}

// ???????????????
export function formDate(str: string, type: string) {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = formatZero(date.getMonth() + 1, 2);
  const day = formatZero(date.getDay(), 2);
  const hour = formatZero(date.getHours(), 2);
  const minute = formatZero(date.getMinutes(), 2);
  const seconds = formatZero(date.getSeconds(), 2);
  if (type === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  if (type === 'YYYY-MM-DD HH:MM:SS') {
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }
  if (type === 'MM/DD HH:MM:SS') {
    return `${month}/${day} ${hour}:${minute}:${seconds}`;
  }
}

// ??????????????????????????????
export function formatZero(num, len) {
  if (String(num).length > len) return num;
  return (Array(len).join('0') + num).slice(-len);
}

// ?????????????????????
export const imageSize = 4 * 1024 * 1024;
// ???????????????????????????
export function uploadBeforeImageValid(file): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const isJapOrPngOrGif =
      file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    const isImageSize = file.size > imageSize ? true : false;
    if (!isJapOrPngOrGif) {
      Message.error('????????????png/jpg/gif????????????');
      return reject(false);
    }
    if (isImageSize) {
      Message.error('??????????????????????????????4M????????????????????????');
      return reject(false);
    }
    return resolve(true);
  });
}

/**
 * key?????????
 * @param params
 * @returns
 */
export const transferKeyTree = (params: transferKeyTreeParams) => {
  const { node, newKey, oldKey, children } = params;
  node.forEach((el) => {
    if (el[oldKey]) {
      el[newKey] = el[oldKey];
      delete el[oldKey];
    }
    if (el[children] instanceof Array) {
      const data = {
        node: el[children],
        newKey,
        oldKey,
        children,
      };
      transferKeyTree(data);
    }
  });
  // ?????????????????????
  return node;
};

export interface transferKeyTreeParams {
  node: Array<any>;
  newKey: string;
  oldKey: string;
  children: string;
}
