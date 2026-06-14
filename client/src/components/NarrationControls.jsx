import { useCallback, useEffect, useState } from "react";
import { narrationService } from "../services/NarrationService.js";

export function NarrationControls({ title, story, lesson, settings = {} }) {
  const [reading, setReading] = useState(false);
  const supported = narrationService.supported();

  const read = useCallback(() => {
    narrationService.speak({ title, story, lesson }, settings, setReading);
  }, [title, story, lesson, settings]);

  useEffect(() => {
    if (settings.narration && supported) read();
    return () => narrationService.stop();
  }, [read, settings.narration, supported]);

  if (!supported) return <small className="narration-unavailable">Read-aloud is unavailable in this browser.</small>;

  return (
    <div className="narration-controls">
      {reading ? (
        <button type="button" onClick={() => narrationService.stop()}>Stop Reading</button>
      ) : (
        <button type="button" onClick={read}>Read Aloud</button>
      )}
    </div>
  );
}
