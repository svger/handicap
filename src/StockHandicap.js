'use strict';

import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';
import styles from './style/index.less';
import { getInfoList, getStockDeltaInfo } from './utils/';
import HandicapPrice from './components/HandicapPrice';
import HandicapDetail from './components/HandicapDetail';

class UI extends Component {
  static propTypes = {
    precision: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),       //精度单位
    handCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),       //一手的单位
    generaType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),      //股票大类别
    tradeTime:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]),      //交易时间
    staticData: PropTypes.shape({
      preClosePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),                        //前收盘价
    }),         //基础信息数据
    socketData: PropTypes.object,         //推送数据
    isStop: PropTypes.bool                //股票状态，SUSPENSION=停牌，DELISTING_FINISHING_PERIOD=退市
  };

  static defaultProps = {
    precision: 2,
    handCount: 100,
    tradeTime: 240,
    isStop: false
  };

  renderHandicapPrice = () => {
    const {  staticData, socketData, precision } = this.props;
    const { lastPrice, openPrice, phase } = socketData;
    const { preClosePrice } = staticData;
    const stockDeltaInfo = getStockDeltaInfo({ lastPrice, openPrice, preClosePrice, phase, precision });

    return (
        <HandicapPrice {...stockDeltaInfo} />
    )
  }

  /**
   * 渲染盘口的详细信息
   * @returns {XML}
   */
  renderDetailInfo = () => {
    return <HandicapDetail infoList={getInfoList({...this.props})} />
  }

  render() {
    return (
        <div styleName="stockInfoContainer">
          {this.renderHandicapPrice()}
          {this.renderDetailInfo()}
        </div>
    )
  }
}

export default CSSModule(UI, styles, {
  allowMultiple: true
});
