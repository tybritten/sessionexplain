import * as React from 'react';
import './App.css';
import { ReadSession } from 'src/utils/GoFlow';
import { Timeline } from './Timeline';
import { Explain } from 'src/utils/Explain';

interface Props { }

interface State {
  source: string;
  explain: Explain | null;
  problem: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { source: '{"status": "waiting", "runs": []}', explain: null, problem: "" };

    this.handleExplain = this.handleExplain.bind(this);
    this.handleChangeSource = this.handleChangeSource.bind(this);
  }

  handleChangeSource(event: any) {
    this.setState({ source: event.target.value });
  }

  handleExplain() {
    try {
      const session = ReadSession(this.state.source)
      const explain = new Explain(session);

      // pretty print the session back out
      const source = JSON.stringify(session, null, 2);

      this.setState({ source: source, explain: explain, problem: "" });
    } catch (e) {
      this.setState({ source: this.state.source, explain: null, problem: e });
    }
  }

  public render() {
    return (
      <div className="App">
        <div className="App-header"><h1>🕵️ GoFlow Session Explain</h1></div>
        <textarea className="App-source" value={this.state.source} onChange={this.handleChangeSource} />
        <button onClick={this.handleExplain}>Explain</button>
        {this.state.problem != "" &&
          <div className="App-problem">{this.state.problem}</div>
        }
        {this.state.explain != null &&
          <div className="App-explain">
            <Timeline frames={this.state.explain.frames} />
          </div>
        }
      </div>
    );
  }
}

export default App;
