import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import CSSModule from 'react-css-modules';
import styles from '../style/StockHandicap.less';
import { getDirectionStyleName } from '../utils/';

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
    delta: PropTypes.string,                                //当前涨跌价
    deltaRate: PropTypes.string,                                //当前涨跌幅
    deltaDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),  //当前涨跌状态
    openDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),   //开盘涨跌状态
  }

  render() {
    const { lastPrice, preClosePrice, openPrice, isStop, deltaDirection, openDirection, deltaRate, delta } = this.props;
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
                      <div styleName={`current-price-gain ${deltaStyle}`}>{delta}</div>
                      <div styleName={`current-price-gain-rate ${deltaStyle}`}>{deltaRate}</div>
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