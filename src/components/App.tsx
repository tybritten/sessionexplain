import * as React from 'react';
import './App.css';
import { ReadSession } from 'src/utils/GoFlow';
import { Timeline } from './Timeline';
import { Explain } from 'src/utils/Explain';

interface Props { }

interface State {
  source: string;
  explain: Explain | null;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { source: '{"status": "waiting", "runs": []}', explain: null };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.setState({ source: event.target.value });
  }

  public render() {
    return (
      <div className="App container">
        <div className="App-header"><h1>GoFlow Session Explain</h1></div>
        <textarea id="source" className="App-source" value={this.state.source} onChange={this.handleChange} />
        <button onClick={this.explain}>Explain</button>
        <div id="problems"></div>
        {this.state.explain != null &&
          <div id="explain">
            <Timeline events={this.state.explain.events} />
          </div>
        }
      </div>
    );
  }

  explain = () => {
    try {
      var session = ReadSession(this.state.source)
      var explain = new Explain(session);

      this.setState({ source: this.state.source, explain: explain })

    } catch (e) {
      console.log('Error:', e);
    }
  }
}

export default App;
