const getIndexList = ({ socketData, staticData, precision, handCount, isStop }) => {
  return [
    {
      name: '最高',
      value: 0
    },
    {
      name: '最低',
      value: 0
    },
    {
      name: '振幅',
      value: 0
    },
    {
      name: '成交量',
      value: 0
    },
    {
      name: '成交额',
      value: 0
    },
    {
      name: '涨家数',
      value: 0
    },
    {
      name: '跌家数',
      value: 0
    },
    {
      name: '平家数',
      value: 0
    }
  ]
}

export default getIndexList;