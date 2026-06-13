export function PauseMenu({ onResume, onSettings, onStorybook, onGuide, onMainMenu }) {
  return (
    <div className="pause-backdrop">
      <article className="pause-card">
        <div className="pause-rune">II</div>
        <p className="eyebrow">Adventure paused</p>
        <h2>Rest by the sanctuary</h2>
        <p>The guardians will wait here until you are ready.</p>
        <div className="pause-actions">
          <button className="primary-button" onClick={onResume}>Resume adventure</button>
          <button onClick={onGuide}>Character guide</button>
          <button onClick={onStorybook}>Storybook</button>
          <button onClick={onSettings}>Settings</button>
          <button className="quiet-button" onClick={onMainMenu}>Return to main menu</button>
        </div>
        <small>Press Esc or P to resume</small>
      </article>
    </div>
  );
}
