import md5 from 'blueimp-md5';
import { isObject, isEmpty, isPlainObject, get, keyBy } from 'lodash';

import { analysisComponentProps } from './analysisProps';

interface ItemProps {
  props: { name: string; value: any; };
  node_id: string;
  parent: string
};

interface ISetFields {
  [key: string]: { value: any } | null;
};

interface IComponentTree {
  component: { defaultProps: any; name: string; [type: string]: string };
  errorComponent: string | null;
  node_id: string;
  parent: string | null;
  props: { [key: string]: { value: any } };
  sort_id: number;
  children: IComponentTree[]
};

interface IMeta {
  schema: {[name: string]: { value: any } };
};

interface IConfig {
  field_properties: { [key: string ]: {value: any} }
};

/**
 * 0: getShareStoreKey 改为 getStateKeys
 * 1: buildStoreKey 改为 generateStateConfig
 * 2: storeKey 改为 stateKey
 * 3: 如果dataSource 为 null 直接return null
 * 配置基本类型也按照 string的形式处理
 */

/**
 * 如果这个组件的state数据需要共享给其它组件，在 Layout 定义此组件的时候需配置
 * [props: shareStore = 'xxxStore']
 * 被分享的组件使用这个state，需要配置 [props: lookupStore = 'xxxStore']
 */
const setStateKey = (shareStore: string, stateKey: string): void => {
  if (shareStore && typeof shareStore === 'string') {
    sessionStorage.setItem(shareStore, stateKey);
  }
};

/**
 * 生成state配置信息
 * @param  {object} props props配置
 * @return {object} {dataSource, stateKey}                                 2
 */
export const generateStateConfig = (props: any): null | object => {
  if (isEmpty(props)) return null;
  const { dataSource, shareStore } = props;
  if (!dataSource || (isObject(dataSource) && isEmpty(dataSource))) return null;
  if (isPlainObject(dataSource)) {
    // tslint:disable-next-line:no-shadowed-variable
    const stateKey = `${dataSource.objName}_${md5(JSON.stringify(dataSource))}`;
    setStateKey(shareStore, stateKey);
    return {
      stateKey,
      dataSource
    };
  }

  const stateKey = md5(dataSource);
  setStateKey(shareStore, stateKey);

  return { stateKey, dataSource };
};

/**
 * getStateKeys
 * @param  {string | array} keys lookupStateKey
 * @return {string | array}      reducer state key
 */
export const getStateKeys = (keys: string | Array<string>): any => {
  // TODO: 某个组件配置多个 lookupStateKey 的情况，暂未出现这种需求
  if (Array.isArray(keys)) {
    const result: any = {};
    keys.forEach(k => {
      result[k] = sessionStorage.getItem(k);
    });
    return result;
  }

  return sessionStorage.getItem(keys);
};

/**
 * get field name && value
 * @param  {object}  item
 */
export const getFieldNameValue = (item: ItemProps, result: ISetFields): ISetFields => {
  const props = (get(item, 'props') || {}) as ItemProps["props"];
  if (props.name) {
    const { name, value } = props;
    if (typeof value === 'undefined') {
      result[name] = null;
    } else {
      result[name] = value;
    }
  }
  return result;
}

/**
 * Build Component Tree
 * @param  {array} layout       layout data
 * @param  {object} renderComps layout map data
 * @return {object}             Component Tree
 */
export const buildComponentTree = (layout: any[], renderComps: { [key: string]: any }): { componentsTree: IComponentTree,  setFieldsObj: ISetFields} | {} => {
  if (!Array.isArray(layout)) {
    return {};
  }

  let root = '';
  const setFieldsObj: ISetFields = {};

  layout.forEach((item: ItemProps) => {
    const { node_id, parent } = item;

    if (parent) {
      renderComps[parent].children.push(renderComps[node_id])
    } else {
      root = node_id;
    }

    getFieldNameValue(item, setFieldsObj);
  });

  return {
    componentsTree: renderComps[root],
    setFieldsObj
  };
};

/**
 * build layout entry
 * @param  {array} layout        layout data
 * @param  {object} components   components data
 * @return {object}              component tree
 */
export const buildPage = (layout: any[]) => {
  const { components } = window.Triones;
  const renderComps = keyBy(layout, item => {
    item.errorComponent = item.component;
    item.component = components[item.component] || 'ComponentNotFound';
    item.children = [];

    return item.node_id;
  });

  return buildComponentTree(layout, renderComps);
};

export const buildPanel = (layout: any[], meta: IMeta, config: IConfig, action: string) => {
  // 引用此方法前请仔细阅读代码执行顺序，确保代码正确执行
  analysisComponentProps(layout, meta, config, action);

  return buildPage(layout);
};
