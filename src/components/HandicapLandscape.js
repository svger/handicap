import React, { Component, PropTypes } from 'react';
import Icon from '@cefc-ui/icon';
import CSSModule from 'react-css-modules';
import styles from '../style/HandicapLandscape.less';
import { getDirectionStyleName } from '../utils/';
import cx from 'classnames';

function isHuaWeiPhone() {
  const userAgent = navigator.userAgent;
  let info =  userAgent.toLowerCase();
  return info.indexOf('huawei') > -1;
}
const WIN_H = window.innerHeight || window.outerHeight - (isHuaWeiPhone() ? 50 : 0);
const WIN_W = window.innerWidth || window.outerWidth;
const STYL = {
  landscape: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: `${WIN_H}px`,
    height: `${WIN_W}px`,
    boxSizing: 'border-box',
    webkitBoxSizing: 'border-box',
    transform: 'rotate(90deg)',
    webkitTransform: 'rotate(90deg)',
    webkitTransformOrigin: `${WIN_W / 2}px ${WIN_W / 2}px`,
    transformOrigin: `${WIN_W / 2}px ${WIN_W / 2}px`,
    zIndex: 10000,
    backgroundColor: '#404040',
    display: 'flex',
    flexDirection: 'column',
    webkitFlexDirection: 'column'
  },
  stockInfo: {
    color: '#ffffff'
  }
};

class HandicapLandscape extends Component {
  static propTypes = {
    alias: PropTypes.string,
    lastPrice: PropTypes.string,
    time: PropTypes.string,
    delta: PropTypes.string,
    deltaRate: PropTypes.string,
    deltaDirection: PropTypes.number,
    highPrice: PropTypes.object,
    lowPrice: PropTypes.object,
    openPrice: PropTypes.object,
    preClosePrice: PropTypes.object,
    volumeRatio: PropTypes.object,
    turnoverRate: PropTypes.object,
    volume: PropTypes.object,
    turnover: PropTypes.object,
    onToggleOrientation: PropTypes.func,
  };

  static defaultProps = {
    onLayout: () => {}
  }

  layout = (ins) => {
    if (!ins) {
      return;
    }

    const { onLayout } = this.props;

    onLayout(ins.offsetHeight);
  };

  render() {
    let {
        alias, lastPrice, time, delta, deltaRate,
        highPrice, lowPrice, openPrice, preClosePrice,
        volumeRatio, turnoverRate, volume, turnover,
        onToggleOrientation,
        deltaDirection
    } = this.props;

    const longPrice = lastPrice && (lastPrice.length > 5);
    const deltaDirectionStyle = getDirectionStyleName(deltaDirection);
    return (
        <div style={STYL.landscape}>
          <div styleName="container" ref={this.layout}>
          <div styleName="info">
            <div styleName="summary">
              <div styleName="row">
                <h2 styleName="stock">{alias}</h2>
                <div styleName={cx('price', deltaDirectionStyle, {'price-small': longPrice})}>{lastPrice}</div>
              </div>
              <div styleName="row">
                <div styleName="time">{time}</div>
                <div styleName="priceDelta">
                  <span styleName={cx('delta', deltaDirectionStyle)}>{delta}</span>
                  <span styleName={deltaDirectionStyle}>{deltaRate}</span>
                </div>
              </div>
            </div>
            <div styleName="detail">
              <div styleName="stretch">
                <div styleName="item">
                  <span>最高</span>
                  <b styleName={highPrice.color}>{highPrice.value}</b>
                </div>
                <div styleName="item">
                  <span>最低</span>
                  <b styleName={lowPrice.color}>{lowPrice.value}</b>
                </div>
              </div>
              <div styleName="stretch">
                <div styleName="item">
                  <span>今开</span>
                  <b styleName={openPrice.color}>{openPrice.value}</b>
                </div>
                <div styleName="item">
                  <span>昨收</span>
                  <b>{preClosePrice.value}</b>
                </div>
              </div>
              <div>
                <div styleName="item">
                  <span>量比</span>
                  <b>{volumeRatio.value}</b>
                </div>
                <div styleName="item">
                  <span>换手率</span>
                  <b>{turnoverRate.value}</b>
                </div>
              </div>
              <div>
                <div styleName="item">
                  <span>成交量</span>
                  <b>{volume.value}</b>
                </div>
                <div styleName="item">
                  <span>成交额</span>
                  <b>{turnover.value}</b>
                </div>
              </div>
            </div>
          </div>
          {/*<div onClick={onToggleOrientation}><Icon type="close-default" /></div>*/}
        </div>
        </div>
    );
  }
}


export default CSSModule(HandicapLandscape, styles, {
  allowMultiple: true
});
