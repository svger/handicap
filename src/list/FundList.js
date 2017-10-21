import StockAlgorithm from '../utils/StockAlgorithm';
import { getFontColor } from '../utils/';

//获取基金信息
const getFundList = ({ socketData, staticData, precision, handCount, isStop }) => {

  let {
      timestamp, tradeVol, turnover, lastVol,
      highPrice, lowPrice, preClosePrice,
      asks, bids
  } = socketData;
  const { limitUp, limitDown, totalPastFiveAvg } = staticData;

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
      name: '委比',
      value: StockAlgorithm.committee({ asks, bids, handCount })
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
      color: (!isStop && staticData.limitUp !== -1) ? 'stock-price-up' : 'stock-price-current'
    },
    {
      name: '跌停',
      value: StockAlgorithm.limitDown({ price: limitDown, stop: isStop, precision: precision }),
      color: (!isStop && staticData.limitDown !== -1) ? 'stock-price-down' : 'stock-price-current'
    },
    {
      name: '委差',
      value: StockAlgorithm.commission({ asks, bids, handCount })
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
      name: '单位净值',
      value: staticData.unitnv ? staticData.unitnv : '--',
    },
    {
      name: '累计净值',
      value: staticData.accumulatedUnitnv ? staticData.accumulatedUnitnv : '--',
    },
  ]
}
export default getFundList;