import React from 'react';
import StockHandicap from '../src/StockHandicap';
import params from '../mock/params';
import socketData from '../mock/sockeData';
import staticData from '../mock/staticData';

class App extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      socketData: {}
    }
  }

  componentDidMount() {
    this.setState({
      socketData: socketData.quote[0]
    })
  }

  render() {
    const { tradeTime, precision, handCount, type } = params;
    const config = Object.assign({
      tradeTime,
      precision,
      handCount,
      isStop: false,
    }, this.state.socketData, staticData)

    return (
       <div>
         <StockHandicap
             generaType={type}
             config={config}
         />
       </div>
    );
  }
}

export default App;
