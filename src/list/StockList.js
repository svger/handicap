import { unitFormat } from '@cefc-utils/format';
import StockAlgorithm from '../utils/StockAlgorithm';
import { getFontColor } from '../utils/';

const getStockList = ({ socketData, staticData, precision, handCount, tradeTime, isStop }) => {
  let {
      timestamp, tradeVol, turnover, lastVol,
      highPrice, lowPrice, preClosePrice, openPrice, lastPrice,
      asks, bids
  } = socketData;
  const { nppLatestYear, publicFloatShareQuantity, limitUp, limitDown, totalPastFiveAvg, outStandingShare } = staticData;

  return [
    {
      name: '最高',
      value: StockAlgorithm.price({ stop: isStop, price: highPrice, precision }),
      color: !isStop && getFontColor(highPrice, preClosePrice)
    },
    {
      name: '最低',
      value: StockAlgorithm.price({ stop: isStop, price: lowPrice, precision }),
      color: !isStop && getFontColor(lowPrice, preClosePrice)
    },
    {
      name: '换手率',
      value: StockAlgorithm.turnoverRate(isStop, tradeVol, publicFloatShareQuantity, handCount, precision)
    },
    {
      name: '成交量',
      value: StockAlgorithm.volume(isStop, tradeVol, handCount, precision),
    },
    {
      name: '成交额',
      value: StockAlgorithm.turnover({ val: turnover, precision: precision, stop: isStop })
    },
    {
      name: '涨停',
      value: StockAlgorithm.limitUp({ price: limitUp, stop: isStop, precision: precision }),
      color: (!isStop && limitUp !== -1) ? 'stock-price-up' : 'ft-common',
    },
    {
      name: '跌停',
      value: StockAlgorithm.limitDown({ price: limitDown, stop: isStop, precision: precision }),
      color: (!isStop && limitDown !== -1) ? 'stock-price-down' : 'ft-common'
    },
    {
      name: '委比',
      value: StockAlgorithm.committee({ asks, bids, handCount })
    },
    {
      name: '均价',
      value: StockAlgorithm.average(isStop, turnover, tradeVol, precision),
      color: !isStop && getFontColor(turnover / tradeVol, staticData.preClosePrice)
    },
    {
      name: '开盘',
      value: StockAlgorithm.price({ stop: isStop, price: openPrice, precision }),
      color: !isStop && getFontColor(openPrice, staticData.preClosePrice)
    },
    {
      name: '振幅',
      value: StockAlgorithm.amplitude({ highPrice, lowPrice, preClosePrice })
    },
    {
      name: '现量',
      value: StockAlgorithm.lastVol({ stop: isStop, lastVol, precision, handCount })
    },
    {
      name: '量比',
      value: StockAlgorithm.volumeRatio(timestamp, totalPastFiveAvg, tradeVol, tradeTime)
    },
    {
      name: '总市值',
      value: StockAlgorithm.marketCap({ stop, preClosePrice, lastPrice, outStandingShare, precision })
    },
    {
      name: '市盈率',
      value: StockAlgorithm.priceEarnign({ nppLatestYear, preClosePrice, lastPrice, outStandingShare, precision })
    },
    {
      name: '流通值',
      value: StockAlgorithm.circulationValue({ publicFloatShareQuantity, lastPrice, preClosePrice, precision })
    },
    {
      name: '流通股',
      value: unitFormat({ value: publicFloatShareQuantity, precision }),
    },
    {
      name: '总股本',
      value: unitFormat({ value: outStandingShare, precision }),
    },
    {
      name: '每股收益',
      value: StockAlgorithm.eps({ precision, val: staticData.eps })
    },
    {
      name: '每股净值',
      value: StockAlgorithm.naps({ precision, val: staticData.naps })
    },
    {
      name: '市净率',
      value: StockAlgorithm.priceRatio({ price: lastPrice, naps: staticData.naps, precision })
    }
  ]
};

export default getStockList;