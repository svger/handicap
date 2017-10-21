import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';
import styles from '../style/index.less';
import CONSTANTS from '../constants';

const GENERAL_TYPE = CONSTANTS.GENERAL_TYPE;
class HandicapDetail extends Component {
  static propTypes = {
    generaType: PropTypes.oneOf([GENERAL_TYPE.STOCK, GENERAL_TYPE.BOND, GENERAL_TYPE.FUND]),
    infoList: PropTypes.array // 盘口列表数据
  }

  static defaultProps = {
    infoList: {}
  }

  constructor(...args) {
    super(...args);
    this.state = {
      showDetail: false
    }
  }

  handleShowDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail
    });
  };

  render() {
    const { showDetail } = this.state;
    const { infoList } = this.props;

    return (
        <div styleName="info-con" onClick={this.handleShowDetail}>
          <div styleName={showDetail ? "show-info" : "close-info"}>
            <ul>
              {infoList.map((item, index) => {
                return (
                    <li key={index} styleName="info-item">
                      <p styleName={`ft-14 pdb-8 ${item.color || 'ft-common'}`}>{item.value}</p>
                      <p styleName="ft-14 body-font-color-gray">{item.name}</p>
                      <p styleName="slip"><span styleName="slip-border">&nbsp;</span></p>
                    </li>
                );
              })}
            </ul>
          </div>
          <div styleName="info-arrow">
            <div styleName={showDetail ? "arrowUp" : "arrowDown"}>{}</div>
          </div>
        </div>
    )
  }
}

export default CSSModule(HandicapDetail, styles, {
  allowMultiple: true
});