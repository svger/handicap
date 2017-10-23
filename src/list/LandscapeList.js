import StockAlgorithm from '../utils/StockAlgorithm';
import { decimalFormat } from '@cefc-utils/format';
import { getFontColor, getDirectionStyleName } from '../utils/';

const getLandscapeHandicapInfo = (config) => {
  let {
      highPrice, lowPrice, openPrice, turnover, tradeVol, timestamp,
      preClosePrice, totalPastFiveAvg, publicFloatShareQuantity,
      precision, handCount, tradeTime, isStop
   } = config;
  let stop = isStop;
  highPrice = highPrice ? decimalFormat(highPrice, precision) : '--';
  lowPrice = lowPrice ? decimalFormat(lowPrice, precision) : '--';
  preClosePrice = decimalFormat(preClosePrice, precision);

  return {
    // 最高
    highPrice: {
      value: StockAlgorithm.price({ stop, price: highPrice, precision }),
      color: !stop && getFontColor(highPrice, preClosePrice)
    },
    // 最低
    lowPrice: {
      value: StockAlgorithm.price({ stop, price: lowPrice, precision }),
      color: !stop && getFontColor(lowPrice, preClosePrice)
    },
    // 开盘
    openPrice: {
      value: StockAlgorithm.price({ stop, price: openPrice, precision }),
      color: !stop && getFontColor(openPrice, preClosePrice)
    },
    // 昨收
    preClosePrice: {
      value: StockAlgorithm.price({ stop, price: preClosePrice, precision }),
    },
    // 量比
    volumeRatio: {
      value: StockAlgorithm.volumeRatio(timestamp, totalPastFiveAvg, tradeVol, tradeTime),
      // TODO: 涨停宝量比有颜色
      color: !stop && getDirectionStyleName(0)
    },
    // 换手率
    turnoverRate: {
      value: StockAlgorithm.turnoverRate(stop, tradeVol, publicFloatShareQuantity, handCount, precision)
    },
    // 成交量
    volume: {
      value: StockAlgorithm.volume(stop, tradeVol, handCount, precision)
    },
    // 成交额
    turnover: {
      value: StockAlgorithm.turnover({ stop, val: turnover, precision })
    }
  }
}

export default getLandscapeHandicapInfo;
