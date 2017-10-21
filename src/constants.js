const CONSTANTS = {
  GENERAL_TYPE: {
    STOCK: 1, //股票
    INDEX: 2, //指数信息
    FUND: 3, //基金
    BOND: 7, //债券
  },
  ORIENTATION: {
    LANDSCAPE: false,
    PORTRAIT: true
  },
  DEFAULT_DELTA_INFO: {
    //股票状态，SUSPENSION=停牌，DELISTING_FINISHING_PERIOD=退市
    isStop: false,
    // 实时涨跌价
    delta: '--',
    // 实时涨跌幅
    deltaRate: '--',
    // 当前价 'green'跌，'white'平，'red'涨
    deltaDirection: 0,
    // 今开盘 'green'跌，'white'平，'red'涨
    openDirection: 0,
    //需要显示盘口信息的股票类别
    showDetailInfo: [1, 3, 7]
  }
};

export default CONSTANTS;

