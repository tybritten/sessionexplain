import * as React from 'react';
import { TimelineStep } from './TimelineStep';
import { ExplainFrame } from 'src/utils/Explain';

interface Props {
    frame: ExplainFrame;
    index: number;
}

export class TimelineFrame extends React.Component<Props> {

    private runColors: string[];

    constructor(props: Props) {
        super(props);

        this.runColors = ['#ff746d', '#8fed4b', '#65baf7', '#bf79e5', '#e5a647', '#a3d831', '#4fd1c8'];
    }

    public render() {
        const frame = this.props.frame;
        const steps = frame.steps.map((step, i) =>
            <TimelineStep step={step} index={i} key={`frame${this.props.index}-step${i}`} />
        );

        const message = `${frame.isResume ? "↩️ Resuming" : "⬇️ Starting"} run #${frame.runIndex + 1}`;
        const indent = `${frame.depth * 15}px`;
        const color = this.runColors[frame.runIndex % this.runColors.length];

        return (
            <div className="Timeline-frame">
                <div className="Frame-run-info" style={{ marginLeft: indent, borderLeftColor: color }}>{message} in <i>{frame.run.flow.name}</i></div>
                <div className="Frame-steps">
                    {steps}
                </div>
            </div>
        );
    }
}