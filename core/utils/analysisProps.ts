/*eslint-disable*/
import { isPlainObject, size, findIndex, get } from 'lodash';
/*
 * analysisComponentProps 做为唯一出口， 返回的是处理过后的完整layout数据
 * */

interface IMeta {
  schema: {[name: string]: { value: any } };
};

interface ISchema {
  nullable?: boolean;
  readable?: boolean;
  insertable?: boolean;
  require?: boolean;
  isRender?: boolean;
  writable?: boolean;
}

interface IConfig {
  field_properties: { [key: string ]: {value: any} }
};

interface IUpdateObj {
  [key: string]: { value: boolean } | any;
}

class HandleProps {
  layout: any[];
  meta: IMeta;
  config: IConfig;
  action: string;

  constructor(layout: any[], meta: IMeta, config: IConfig, action: string) {
    this.meta = meta;
    this.config = config;
    this.layout = layout;
    this.action = action;
  }

  // 获取需要修改的属性
  getUpdateProps(): {[name: string]: { value: any } } {
    const result: {[name: string]: { value: any } } = {};
    const { field_properties } = this.config;

    this.layout.forEach(item => {
      const propsName = get(item, 'props.name');
      if (propsName) {
        // field properties 全局配置 如果有字段级配置的优先级高于全局字段属性配置
        const fieldProperties: { [key: string]: { value: any } } = get(field_properties, [propsName]);

        if (fieldProperties) {
          item.props = Object.assign({}, fieldProperties, item.props);
        }

        result[propsName] = {
          ...this.handleMeta(item.props)
        };
      }
    });
    return result;
  }

  // 获取字段的props属性 {[name]: {...props}}
  getFieldsProps(): {[name: string]: { value: any } } {
    const result: {[name: string]: { value: any } } = {};
    this.layout.forEach(item => {
      if (isPlainObject(item.props)) {
        const { name, ...others } = item.props;
        result[name] = others;
      }
    });
    return result;
  }

  // 修改属性
  updateProps(updateObj: IUpdateObj): void {
    this.deleteLayout(updateObj);
    for (const key in this.layout) {
      if (this.layout.hasOwnProperty(key)) {
        const item = this.layout[key];
        const propsName = get(item, 'props.name');

        if (propsName && updateObj[propsName]) {
          const curProps = item.props;
          const updateProps = updateObj[propsName];
          const defaultDisabled: { disabled?: boolean } = {};

          if (curProps.enable === false || updateProps.enable === false) {
            defaultDisabled.disabled = true;
          }
          item.props = Object.assign(defaultDisabled, curProps, updateProps);
        }
      }
    }
  }

  // 将不需要渲染的组件从layout中删除
  deleteLayout(updateObj: IUpdateObj): void {
    for (const key in updateObj) {
      if (updateObj.hasOwnProperty(key)) {
        const { isRender, visible } = updateObj[key];

        if (visible === false || isRender === false) {
          this.spliceIndex(key);
        }
      }
    }
  }

  spliceIndex(key: string): void {
    const layout = this.layout;
    const index = findIndex(layout, item => {
      if (isPlainObject(item.props)) {
        const { name } = item.props;
        return name === key;
      }
      return false;
    });

    this.layout.splice(index, 1);
  }

  handleMeta(props: any) {
    const { name, visible = false } = props;
    const { schema } = this.meta;
    const action = this.action;
    const defaultSchema: any = {};
    const prop = schema[name] ? schema[name] : defaultSchema;

    if (size(prop) > 0) {
      const { nullable, insertable, writable }: ISchema = prop;

      if (!nullable) {
        prop.require = true;
      }

      if (action === 'create' && !insertable) {
        prop.isRender = visible;
      }

      if (action === 'update' && !writable) {
        prop.isRender = visible;
      }
    }
    return Object.assign({}, props, prop);
  }

  mergeProps() {
    const updateObj = this.getUpdateProps();

    if (isPlainObject(updateObj) && size(updateObj) > 0) {
      this.updateProps(updateObj);
    }
    return this;
  }

  getLayout() {
    return this.layout;
  }
}

/*
 * @param {layout} redux 中的layout数据
 * @param {meta} 当前标准对象的meta
 * @param {config} 配置
 * @return {layout} 按层级调用，最后调用原型上getLayout。
 * */
export const analysisComponentProps = (layout: any[], meta: IMeta, config: IConfig, action: string) =>
  // 唯一入口
  new HandleProps(layout, meta, config, action).mergeProps().getLayout();
