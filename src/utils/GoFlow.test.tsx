import { ReadSession } from './GoFlow';

it('loads session from JSON', () => {
    // loads when top-level object is session
    expect(ReadSession('{"status": "complete", "runs": []}')).toMatchObject({ status: "complete", runs: [] });

    // loads when session is nested object
    expect(ReadSession('{"session": {"status": "complete", "runs": []}}')).toMatchObject({ status: "complete", runs: [] });
})