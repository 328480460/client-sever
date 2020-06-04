/**
 * @author:      lvhaibin
 * @dateTime:    2018-04-09
 * @description: render page by layout tree
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'antd';

import components from 'components';
import { generateStateConfig, getStateKeys } from './utils/index';

interface IComponentTree {
  id: string;
  component: any;
  name: { [type: string]: string };
  errorComponent: string | null;
  node_id: string;
  parent: string | null;
  props: { [key: string]: { value: any } };
  sort_id: number;
  children: IComponentTree[];
  otherProps: any;
}

interface IProps {
  componentsTree: IComponentTree;
}

const createElement = (comp: IComponentTree, defaults: any): React.ReactElement => {
  const { id: componentId, props, component, errorComponent, children = [] } = comp;

  /* eslint-disable-next-line */
  const storeParam = generateStateConfig(props);
  const { name = component, defaultProps } = component;

  if (components[name]) {
    return React.createElement(
      components[name],
      {
        key: componentId,
        getStateKeys,
        errorComponent,
        componentId,
        ...defaultProps,
        ...defaults,
        ...props,
        ...storeParam
      },
      ...children.map(child => createElement(child, defaults))
    );
  }
  return (
    <Alert style={{ marginTop: 10 }} message={`${name || 'component'} Not Found`} type="error" />
  );
};

export const Builder = (props: IProps) => {
  const { componentsTree, ...otherProps } = props;
  const message = 'layout data or components data read failed~';

  if (componentsTree) {
    return createElement(componentsTree, otherProps);
  }
  return <div>{message}</div>;
};

Builder.propTypes = {
  componentsTree: PropTypes.object
};
