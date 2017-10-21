import StockAlgorithm from '../utils/StockAlgorithm';
import { getFontColor } from '../utils/';

//获取债券信息
const getBondList = ({ socketData, staticData, precision, handCount, isStop }) => {
  let {
      timestamp, tradeVol, turnover, lastVol,
      highPrice, lowPrice, preClosePrice, openPrice, lastPrice,
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
    }
  ]
}

export default getBondList;