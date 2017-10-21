import Big from 'big.js';
import { decimalFormat, getTimeIndex, unitFormat } from '@cefc-utils/format';
import { isEmpty } from '@cefc-utils/core';
import { isNull } from './index';

//获取累计开盘时间
function _getOpenMinute(timestamp) {
  if (isEmpty(timestamp)) {

    return;
  }

  timestamp = timestamp.toString();//20161229155003000

  let hour = 9;
  let minute = 30;

  let openMinute = 0;

  if (timestamp) {
    let hour = timestamp.slice(8, 10);
    let minute = timestamp.slice(10, 12);

    if (hour >= 15 || (new Date().getHours() >= 15)) { //close
      openMinute = 4 * 60;
    } else {
      openMinute = getTimeIndex(timestamp.slice(8, 12))
    }

    if (openMinute <= 0) {
      openMinute = 0
    }
  }

  return openMinute;
}

const StockAlgorithm = {
  HOLDER: '--',
  PRECISION: 2,
  HANDCOUNT: 100,
  // 换手率 = 总成交金额 / 流通股本
  turnoverRate(stop, tradeVol, publicFloatShareQuantity, handCount, precision) {
    if (stop || isNull(tradeVol) || isNull(publicFloatShareQuantity) || isNull(handCount)) {
      return StockAlgorithm.HOLDER;
    }

    const _tradeVol = new Big(tradeVol);
    const _publicFloatShareQuantity = new Big(publicFloatShareQuantity);
    const _handCount = new Big(handCount);

    if (_publicFloatShareQuantity.eq(0)) {
      return StockAlgorithm.HOLDER;
    }

    const r = _tradeVol.div(_publicFloatShareQuantity).times(_handCount).toFixed(precision);

    return `${r}%`;
  },
  // 成交量 = 总成交额 / 手数
  volume(stop, tradeVol, handCount, precision) {
    if (stop || isNull(tradeVol) || isNull(handCount)) {
      return StockAlgorithm.HOLDER;
    }

    const _tradeVol = new Big(tradeVol);
    const _handCount = new Big(handCount);

    return unitFormat({
      value: _tradeVol.div(_handCount).toFixed(precision),
      precision,
      isInteger: true
    });
  },
  // 成交额
  turnover({ val, stop, precision = StockAlgorithm.PRECISION }) {
    if (stop || isNull(val)) {
      return StockAlgorithm.HOLDER;
    }

    return unitFormat({ value: val, precision });
  },
  // 量比 = (成交量／当日已开盘分钟数）／ 前5日平均每分钟成交量
  volumeRatio(timestamp, totalPastFiveAvg, tradeVol, tradeTime = 240) {
    if (isNull(timestamp) || timestamp === 0 || isNull(totalPastFiveAvg) || isNull(tradeVol) || isNull(tradeTime)) {
      return StockAlgorithm.HOLDER;
    }

    const openMinute = _getOpenMinute(timestamp);

    if (isEmpty(openMinute) || openMinute <= 0 || totalPastFiveAvg <= 0) {
      return StocklgorithmAs.HOLDER;
    }

    const _tradeVol = new Big(tradeVol);
    const _totalPastFiveAvg = new Big(totalPastFiveAvg);
    const _tradeTime = new Big(tradeTime);
    const _openMinute = new Big(openMinute);

    return _tradeVol.div(_openMinute).div(_totalPastFiveAvg.div(_tradeTime)).toFixed(2);
  },
  // 价格
  price({ stop, price, precision }) {
    if (stop || isNull(price) || (price === 0)) {
      return StockAlgorithm.HOLDER;
    }

    const _price = new Big(price);

    if (_price.eq(0)) {
      return StockAlgorithm.HOLDER;
    }

    return _price.toFixed(precision);
  },
  // 均价
  average(stop, turnover, tradeVol, precision) {
    if (stop || isNull(turnover) || isNull(tradeVol)) {
      return StockAlgorithm.HOLDER;
    }

    const _turnover = new Big(turnover);
    const _tradeVol = new Big(tradeVol);

    if (_tradeVol.eq(0)) {
      return StockAlgorithm.HOLDER;
    }

    return _turnover.div(_tradeVol).toFixed(precision);
  },
  //最高价
  highPrice({ price, stop, precision }) {
    if (price === 0) {
      return StockAlgorithm.HOLDER;
    }

    return StockAlgorithm.price({ price, stop, precision});
  },
  //最低价
  lowPrice(lPrice, stop) {
    return StockAlgorithm.highPrice(lPrice, stop);
  },
  //涨停价
  limitUp({ price, precision = StockAlgorithm.PRECISION, stop } = {}) {
    //-1代表该值不存在时的的默认值，后端定义
    if (price === -1) {
      return StockAlgorithm.HOLDER;
    }

    return StockAlgorithm.price({ price, precision, stop, });
  },
  //跌停价
  limitDown({ price, precision = StockAlgorithm.PRECISION, stop } = {}) {
    return StockAlgorithm.limitUp({ price, precision, stop });
  },
  //委比 = (总买手 + 总卖手) / (总买手 - 总卖手) * 100%
  committee({ asks = {}, bids = {}, precision = StockAlgorithm.PRECISION, handCount =StockAlgorithm.HANDCOUNT  } = {}) {
    const asksVal = Object.values(asks);
    const bidsVal = Object.values(bids);
    let sellTotalVol = 0; //卖总成交量
    let buyTotalVol = 0; //买总成交量

    if (isEmpty(asksVal) && isEmpty(bidsVal)) {

      return StockAlgorithm.HOLDER;
    }

    asksVal.forEach((item) => {
      sellTotalVol = isEmpty(item.totalLevelVol) ? sellTotalVol : (sellTotalVol + item.totalLevelVol);
    });

    bidsVal.forEach((item) => {
      buyTotalVol = isEmpty(item.totalLevelVol) ? buyTotalVol: (buyTotalVol + item.totalLevelVol)
    });

    const committeeVal = (buyTotalVol - sellTotalVol) / (buyTotalVol + sellTotalVol) * handCount;

    return `${decimalFormat(committeeVal)}%`;
  },
  //委差
  commission({ asks = {}, bids = {}, precision = StockAlgorithm.PRECISION, handCount =StockAlgorithm.HANDCOUNT  } = {}) {
    const asksVal = Object.values(asks);
    const bidsVal = Object.values(bids);
    let sellTotalVol = 0; //卖总成交量
    let buyTotalVol = 0; //买总成交量

    if (isEmpty(asksVal) && isEmpty(bidsVal)) {

      return StockAlgorithm.HOLDER;
    }

    asksVal.forEach((item) => {
      sellTotalVol = isEmpty(item.totalLevelVol) ? sellTotalVol : (sellTotalVol + item.totalLevelVol);
    });

    bidsVal.forEach((item) => {
      buyTotalVol = isEmpty(item.totalLevelVol) ? buyTotalVol: (buyTotalVol + item.totalLevelVol)
    });

    return (buyTotalVol - sellTotalVol) / handCount;
  },
  //振幅 = ((最高价 - 最低价 ) / 前收盘价) %
  amplitude({ stop, highPrice ,lowPrice ,preClosePrice, handCount = StockAlgorithm.HANDCOUNT, precision = StockAlgorithm.PRECISION } = {}) {
    if (stop || isNull(highPrice) || isNull(lowPrice) || isNull(preClosePrice)) {
      return StockAlgorithm.HOLDER;
    }

    const hPrice = new Big(highPrice);
    const lPrice = new Big(lowPrice);
    const pClosePrice = new Big(preClosePrice);

    return (((hPrice - lPrice) / pClosePrice) * handCount).toFixed(precision);
  },
  //现量
  lastVol({ stop, lastVol, handCount, precision }) {
    if (stop) {

      return StockAlgorithm.HOLDER;
    }

    return unitFormat({ value: lastVol / handCount, precision, isInteger: true });
  },
  //总市值 = 总股本 * 当前价
  marketCap({ stop, outStandingShare, lastPrice, preClosePrice, precision } = {}) {
    const price = stop ? preClosePrice : lastPrice;

    //手机端数据过长容易折行，总市值不保留小数
    return unitFormat({ value: outStandingShare * price, precision, isInteger: true })
  },
  //动态市盈率 = 股价/过去四个季度的EPS
  priceEarnign({ nppLatestYear, outStandingShare, lastPrice = 0, preClosePrice = 0, precision = StockAlgorithm.PRECISION } = {}) {
    if (isNull(nppLatestYear) || isNull(outStandingShare)) {

      return StockAlgorithm.HOLDER;
    }

    const ossVal = new Big(outStandingShare);
    const lPrice = new Big(lastPrice);
    const pPrice = new Big(preClosePrice);

   return ossVal.times(lPrice || pPrice).div(nppLatestYear).toFixed(precision);
  },
  //流通值 = 该股当前股价X流通部分的股票数
  circulationValue({ stop, publicFloatShareQuantity, lastPrice, preClosePrice, precision }) {
    const price = stop ? preClosePrice : lastPrice;

    return unitFormat({ value: publicFloatShareQuantity * price, precision, isInteger: true })
  },
  //每股收益
  eps({ val, precision }) {
    if (isNull(val)) {

      return StockAlgorithm.HOLDER;
    }

    const epsVal = new Big(val);

    return epsVal.toFixed(precision);
  },
  //每股净值
  naps({ val, precision }) {
    return StockAlgorithm.eps({ val, precision });
  },
  //市净率 = 每股市价/每股净资产
  priceRatio({ price, naps, precision }) {
    if (isNull(price) || isNull(naps)) {

      return StockAlgorithm.HOLDER;
    }

    const pVal = new Big(price);

    return pVal.div(naps).toFixed(precision);
  }

};

export default StockAlgorithm;