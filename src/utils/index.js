import Big from 'big.js';
import { isEmpty } from '@cefc-utils/core';
import CONSTANTS from '../constants';
import getStockList from '../list/StockList';
import getFundList from '../list/FundList';
import getBondList from '../list/BondList';
import getIndexList from '../list/IndexList';

export const isNull = (s) => {
  return s == null;
}

export const isEmptyStr = (s) => {
  return !isNull(s) && String(s).trim() === '';
}

export const getInfoList = (() => {
  const fn = {
    [`${CONSTANTS.GENERAL_TYPE.STOCK}`]: getStockList,
    [`${CONSTANTS.GENERAL_TYPE.FUND}`]: getFundList,
    [`${CONSTANTS.GENERAL_TYPE.BOND}`]: getBondList,
    [`${CONSTANTS.GENERAL_TYPE.INDEX}`]: getIndexList,
  };

  return ({ config = {}, generaType } = {}) => {
    const key = generaType ? generaType.toString() : CONSTANTS.GENERAL_TYPE.STOCK.toString();

    return fn[key](config);
  }
})();

//计算涨跌幅，涨跌价
export const getStockDeltaInfo = ({ lastPrice, openPrice, preClosePrice, phase, precision }) => {
  if (isEmpty(lastPrice) || isEmpty(phase) || isEmpty(preClosePrice)) {

    return CONSTANTS.DEFAULT_DELTA_INFO;
  }

  const _lastPrice = new Big(lastPrice);   //最新价
  const _preClosePrice = new Big(preClosePrice);   //前收盘价
  // 判断是否临时停牌
  // 1 开盘前，基础信息告知股票是停牌，开盘后，推送信息可能更新股票状态，改为开盘
  // 2 开盘前，基础信息告知股票未停牌，开盘后，推送信息可能更新股票状态，为停牌
  let ret = { isStop: phase === 5, ...CONSTANTS.DEFAULT_DELTA_INFO };
  const zero = new Big(0);

  //最新价为0
  if (_lastPrice.eq(zero)) {

    return ret;
  }

  const delta = _lastPrice.minus(_preClosePrice).toFixed(precision);
  const deltaRate = _lastPrice.minus(_preClosePrice).div(_preClosePrice).times(100).toFixed(2);;

  ret.lastPrice = _lastPrice.toFixed(precision);
  ret.preClosePrice = _preClosePrice.toFixed(precision);
  // 当前涨跌状态
  ret.deltaDirection = _lastPrice.cmp(_preClosePrice);
  // 涨跌价
  ret.delta = getChange(delta, ret.deltaDirection, ret.lastPrice);
  // 涨跌幅, 带%的字段都保留两位小数，与涨停宝保持一致
  ret.deltaRate = `${getChange(deltaRate, ret.deltaDirection, ret.lastPrice)}%`;

  //开盘期间的涨跌数据, 集合竞价期间无开盘价
  if (openPrice) {
    const _openPrice = new Big(openPrice);     //开盘价
    ret.openPrice = _openPrice.toFixed(precision);
    ret.openDirection = _openPrice.cmp(_preClosePrice);     // 开盘涨跌状态
  }

  return ret
}

// 根据涨跌状态获取涨跌平样式名
export const getDirectionStyleName = (direction) => {
  if (direction > 0) { // 涨
    return 'stock-price-up';
  }

  if (direction < 0) {
    return 'stock-price-down';
  }

  return 'stock-price-current';
};

export const getFontColor = (a, b) => {
  if (isNaN(a) || isNaN(b) || isNull(a) || isNull(b) || isEmptyStr(a) || isEmptyStr(b) || a===0) {
    return getDirectionStyleName(0);  //默认返回白色，而非红或绿
  }

  const _a = new Big(a);
  const _b = new Big(b);

  const direction = _a.cmp(_b);

  return getDirectionStyleName(direction);
};

export const getChange = (delta, direction, lastPrice) => {
  if (lastPrice === 0) {

    return delta;
  }

  return (direction > 0) ? `+${delta}` : delta;
}

export const formatStockPriceTime = (timestamp) => {
  if (!timestamp) {
    return '--';
  }

  timestamp = timestamp.toString();

  return `${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}`;
}

