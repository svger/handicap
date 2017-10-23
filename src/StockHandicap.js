'use strict';

import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';
import styles from './style/StockHandicap.less';
import { getInfoList, getStockDeltaInfo, formatStockPriceTime } from './utils/';
import getLandscapeHandicapInfo from './list/LandscapeList';
import HandicapPrice from './components/HandicapPrice';
import HandicapDetail from './components/HandicapDetail';
import HandicapLandscape from './components/HandicapLandscape';

class StockHandicap extends Component {
  static propTypes = {
    generaType: PropTypes.oneOf(['1', '2', '3', '7']),                                                //股票大类别, 1是股票，2是指数，3基金，7债券
    landscape: PropTypes.bool,                                                                        //是否是横屏,
    config: PropTypes.shape({
      tradeTime:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]),                          //交易时间
      handCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),                           //一手的单位
      precision: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),                           //精度单位
      isStop: PropTypes.bool,                                                                         //股票状态，SUSPENSION=停牌，DELISTING_FINISHING_PERIOD=退市
      preClosePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),                       //前收盘价
      openPrice: PropTypes.number,                                                                    //开盘价
      lastPrice: PropTypes.number,                                                                    //现价
      lowPrice: PropTypes.number,                                                                     //最低价
      highPrice: PropTypes.number,                                                                    //最高价
      alias: PropTypes.string,                                                                        //股票名称
      asks: PropTypes.object,                                                                         //五档买数量
      bids: PropTypes.object,                                                                         //五档卖数量
      limitUp: PropTypes.number,                                                                      //涨停价
      limitDown: PropTypes.number,                                                                    //跌停价
      timestamp: PropTypes.number,                                                                    //时间戳
      tradeVol: PropTypes.number,                                                                     //总成交量
      lastVol: PropTypes.number,                                                                      //现量
      publicFloatShareQuantity: PropTypes.number,                                                     //流通值
      phase: PropTypes.number,                                                                        //证券状态
      nppLatestYear: PropTypes.number,                                                                //最新公布年度归母净利润
      totalPastFiveAvg: PropTypes.number,                                                             //过去5日平均每日成交量
      outStandingShare: PropTypes.number,                                                             //总发行量（总股本）
      turnover: PropTypes.number,                                                                     //成交额
    })
  };

  static defaultProps = {
    landscape: false,
    generaType: '1', //股票
    config: {
      tradeTime: 240,
      handCount: 100,
      precision: 2,
      isStop: false,
      asks: {},
      bids: {}
    }
  };

  renderHandicapPrice = () => {
    const { lastPrice, openPrice, phase, preClosePrice, precision } = this.props.config;
    const stockDeltaInfo = getStockDeltaInfo({ lastPrice, openPrice, preClosePrice, phase, precision });

    return (
        <HandicapPrice {...stockDeltaInfo}  />
    )
  }

  /**
   * 渲染盘口的详细信息
   * @returns {XML}
   */
  renderDetailInfo = () => {
    return <HandicapDetail infoList={getInfoList({ ...this.props })} />
  }

  renderHandicapLandscape = () => {
    const { lastPrice, openPrice, phase, preClosePrice, alias, precision, timestamp } = this.props.config;
    const stockDeltaInfo = getStockDeltaInfo({ lastPrice, openPrice, preClosePrice, phase, precision });
    const landscapeList = getLandscapeHandicapInfo(this.props.config);

    return (
        <HandicapLandscape
          alias={alias}
          time={formatStockPriceTime(timestamp)}
          {...stockDeltaInfo}
          {...landscapeList}
        />
    )
  }

  render() {
    const { landscape } = this.props;

    if (landscape) {
      return this.renderHandicapLandscape();
    }

    return (
        <div styleName="stockInfoContainer">
          {this.renderHandicapPrice()}
          {this.renderDetailInfo()}
        </div>
    )
  }
}

StockHandicap.landscape = '';

export default CSSModule(StockHandicap, styles, {
  allowMultiple: true
});
