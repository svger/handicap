import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import CSSModule from 'react-css-modules';
import styles from '../style/index.less';

// 根据涨跌状态获取涨跌平样式名
const getDirectionStyleName = (direction) => {
  if (direction > 0) { // 涨
    return 'stock-price-up';
  }

  if (direction < 0) {
    return 'stock-price-down';
  }

  return 'stock-price-current';
};

const getChange = (delta, direction, lastPrice) => {
  if (lastPrice === 0) {

    return delta;
  }

  return (direction > 0) ? `+${delta}` : delta;
}

class HandicapPrice extends Component {
  static propTypes = {
    isStop: PropTypes.bool,                                //最新价
    lastPrice: PropTypes.string,                                //最新价
    preClosePrice: PropTypes.string,                            //前收盘价
    openPrice: PropTypes.string,                                //开盘价
    priceChange: PropTypes.string,                                //当前涨跌价
    priceChangeRate: PropTypes.string,                                //当前涨跌幅
    deltaDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),  //当前涨跌状态
    openDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),   //开盘涨跌状态
  }

  render() {
    const { lastPrice, preClosePrice, openPrice, isStop, deltaDirection, openDirection, priceChangeRate, priceChange } = this.props;
    const deltaStyle = getDirectionStyleName(deltaDirection);
    const openStyle = getDirectionStyleName(openDirection);
    const deltaDirectionStyleName = cx({
      'current-price': true,
      'ft-common': isStop,
      [`${deltaStyle}`]: !isStop
    })

    const openDirectionStyleName = cx({
      'ft-14': true,
      'ft-common': isStop,
      [`${openStyle}`]: !isStop
    })

    return  (
        <div styleName="price-con">
          <div styleName="current-price-con">
            <div styleName={deltaDirectionStyleName}>
              {lastPrice || preClosePrice}
            </div>
            {!isStop ? (
                    <div>
                      <div styleName={`current-price-gain ${deltaStyle}`}>{getChange(priceChange, deltaDirection, lastPrice)}</div>
                      <div styleName={`current-price-gain-rate ${deltaStyle}`}>{getChange(`${priceChangeRate}%`, deltaDirection, lastPrice)}</div>
                    </div>
                ) : <div styleName="suspension">停牌</div>}
          </div>
          <div styleName="day-price-con">
            <div styleName="day-price">
              <p styleName={openDirectionStyleName}>
                {openPrice || '--'}
              </p>
              <p styleName="ft-12 body-font-color-gray">今开</p>
              <p styleName="slip"><span styleName="slip-border">&nbsp;</span></p>
            </div>
            <div styleName="day-price">
              <p styleName="ft-14 ft-common">{preClosePrice}</p>
              <p styleName="ft-12 body-font-color-gray">昨收</p>
            </div>
          </div>
        </div>
    )
  }
}

export default CSSModule(HandicapPrice, styles, {
  allowMultiple: true
});