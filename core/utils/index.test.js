import md5 from 'blueimp-md5';
import { getStateKeys, generateStateConfig } from './index';

describe('getStateKeys test', () => {
  sessionStorage.setItem('shareStateKey1', 'stateKey1');
  sessionStorage.setItem('shareStateKey2', 'stateKey2');
  sessionStorage.setItem('shareStateKey3', 'stateKey3');

  it('return a string if the argument is a string', () => {
    expect(getStateKeys('shareStateKey1')).toEqual('stateKey1');
  });

  it('return a object if the argument is an array', () => {
    expect(getStateKeys(['shareStateKey1', 'shareStateKey2', 'shareStateKey3'])).toEqual({
      shareStateKey1: 'stateKey1',
      shareStateKey2: 'stateKey2',
      shareStateKey3: 'stateKey3'
    });

    sessionStorage.removeItem('shareStateKey1');
    sessionStorage.removeItem('shareStateKey2');
    sessionStorage.removeItem('shareStateKey3');
  });
});

describe('generateStateConfig test', () => {
  const props = {
    dataSource: {
      objName: 'Leads',
      fields: ['name', 'Status', 'updated_at', 'created_at', ['Leads.owner.name', 'ownerName']],
      cond: null,
      limit: 10,
      offset: 0,
      order: [['updated_at', 'DESC']]
    },
    shareStore: 'LeadsTableStore'
  };

  it('if the "props" argument is a null or "{}"', () => {
    expect(generateStateConfig(null)).toEqual(null);
    expect(generateStateConfig({})).toEqual(null);
    expect(generateStateConfig({ dataSource: null })).toEqual(null);
    expect(generateStateConfig({ dataSource: {} })).toEqual(null);
  });

  it('if the "props" or "dataSource" argument is a string', () => {
    expect(generateStateConfig('good man')).toEqual(null);
    expect(generateStateConfig({ dataSource: 'good man' })).toEqual({
      dataSource: 'good man',
      stateKey: md5('good man')
    });
  });

  it('if the "props" or "dataSource" argument is a string', () => {
    expect(generateStateConfig('good man')).toEqual(null);
    expect(generateStateConfig({ dataSource: 'good man' })).toEqual({
      dataSource: 'good man',
      stateKey: md5('good man')
    });
  });

  it('if the "props" and "dataSource" argument is a object', () => {
    const dataSource = props.dataSource;
    const expectedStateKey = `${dataSource.objName}_${md5(JSON.stringify(dataSource))}`;
    expect(generateStateConfig(props)).toEqual({
      dataSource,
      stateKey: expectedStateKey
    });
    expect(getStateKeys(props.shareStore)).toEqual(expectedStateKey);
  });
});
