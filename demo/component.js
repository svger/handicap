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

    return (
       <div>
         <StockHandicap
             tradeTime={tradeTime}
             precision={precision}
             handCount={handCount}
             generaType={type}
             socketData={this.state.socketData}
             staticData={staticData}
             isStop={false}
         />
       </div>
    );
  }
}

export default App;
