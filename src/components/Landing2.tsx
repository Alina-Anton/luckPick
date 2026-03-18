import React, { useEffect, useMemo, useState } from "react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const rotatingIdeas = useMemo(
    () => ["Walk in the park", "Call a friend", "Try a new recipe", "Take a sunset break"],
    []
  );

  const previewIdeas = useMemo(
    () => [
      "Go for a sunset walk",
      "Make a smoothie",
      "Stretch for 5 minutes",
      "Read 10 pages",
      "Write a quick gratitude note",
      "Call someone you miss",
    ],
    []
  );

  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [previewPick, setPreviewPick] = useState<string | null>(null);
  const [savedPicks, setSavedPicks] = useState<string[]>([]);

  const todaysPick = useMemo(() => {
    const dayKey = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < dayKey.length; i += 1) {
      hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
    }
    return previewIdeas[hash % previewIdeas.length];
  }, [previewIdeas]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRotatingIndex((i) => (i + 1) % rotatingIdeas.length);
    }, 1700);
    return () => window.clearInterval(id);
  }, [rotatingIdeas.length]);

  const pickForMe = () => {
    const next = previewIdeas[Math.floor(Math.random() * previewIdeas.length)];
    setPreviewPick(next);
  };

  const savePick = () => {
    if (!previewPick) return;
    setSavedPicks((prev) => [previewPick, ...prev].slice(0, 5));
  };

  return (
    <main className="lp-landing">
      <div className="lp-landing__hero">
        <div className="lp-landing__heroContent">
          <div className="lp-landing__brand">LuckPick 🎡</div>
          <h1 className="lp-landing__title">Spin your day. Choose your adventure.</h1>
          <p className="lp-landing__subtitle">
            You don’t need to decide — just discover.
          </p>

          <div className="lp-landing__rotating">
            <span className="lp-landing__rotatingLabel">Idea:</span>
            <span className="lp-landing__rotatingText" aria-live="polite">
              {rotatingIdeas[rotatingIndex]}
            </span>
          </div>

          <div className="lp-landing__ctaRow">
            <button className="lp-landing__ctaPrimary" onClick={onStart}>
              Try LuckPick
            </button>
            <button className="lp-landing__ctaSecondary" onClick={() => document.getElementById("lp-preview")?.scrollIntoView({ behavior: "smooth" })}>
              Try a Random Pick
            </button>
          </div>

          <div className="lp-landing__today">
            <span className="lp-landing__todayBadge">Today’s Pick</span>
            <span className="lp-landing__todayText">✨ {todaysPick}</span>
          </div>
        </div>

        <div className="lp-landing__floatStage" aria-hidden="true">
          <div className="lp-floatCard lp-floatCard--a">Outdoor 🌿</div>
          <div className="lp-floatCard lp-floatCard--b">Self-care 🧘</div>
          <div className="lp-floatCard lp-floatCard--c">Creative 🎨</div>
          <div className="lp-floatCard lp-floatCard--d">Quick ideas ⚡</div>
        </div>
      </div>

      <section className="lp-section lp-how" aria-label="How it works">
        <h2 className="lp-section__title">Make decisions in seconds</h2>
        <div className="lp-grid lp-grid--how">
          <div className="lp-card">
            <div className="lp-card__icon">➕</div>
            <div className="lp-card__title">Add your options</div>
            <div className="lp-card__text">Work, fun, self-care — anything.</div>
          </div>
          <div className="lp-card">
            <div className="lp-card__icon">🎯</div>
            <div className="lp-card__title">Get a random pick</div>
            <div className="lp-card__text">No overthinking. Just action.</div>
          </div>
          <div className="lp-card">
            <div className="lp-card__icon">🃏</div>
            <div className="lp-card__title">Explore ideas</div>
            <div className="lp-card__text">Shuffle activities until one clicks.</div>
          </div>
          <div className="lp-card">
            <div className="lp-card__icon">⭐</div>
            <div className="lp-card__title">Track what you loved</div>
            <div className="lp-card__text">Build your inspiration list.</div>
          </div>
        </div>
      </section>

      <section id="lp-preview" className="lp-section lp-preview" aria-label="Preview">
        <h2 className="lp-section__title">Not sure what to do?</h2>
        <div className="lp-preview__card">
          <button className="lp-preview__pickButton" onClick={pickForMe}>
            Pick for me
          </button>

          <div className="lp-preview__result" role="status" aria-live="polite">
            {previewPick ? (
              <span className="lp-preview__resultText">✨ “{previewPick}”</span>
            ) : (
              <span className="lp-preview__resultMuted">Click “Pick for me” to get an idea.</span>
            )}
          </div>

          <div className="lp-preview__actions">
            <button className="lp-preview__action" onClick={pickForMe}>
              Try again
            </button>
            <button className="lp-preview__action lp-preview__action--primary" onClick={savePick} disabled={!previewPick}>
              Save it
            </button>
          </div>

          {!!savedPicks.length && (
            <div className="lp-preview__saved">
              <div className="lp-preview__savedTitle">Saved</div>
              <ul className="lp-preview__savedList">
                {savedPicks.map((p, idx) => (
                  <li key={`${p}-${idx}`} className="lp-preview__savedItem">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="lp-section lp-categories" aria-label="Categories">
        <h2 className="lp-section__title">Explore your options</h2>
        <div className="lp-grid lp-grid--cats">
          <div className="lp-category lp-category--1">Outdoor 🌿</div>
          <div className="lp-category lp-category--2">Self-care 🧘‍♀️</div>
          <div className="lp-category lp-category--3">Social ☎️</div>
          <div className="lp-category lp-category--4">Creative 🎨</div>
          <div className="lp-category lp-category--5">Food 🍳</div>
          <div className="lp-category lp-category--6">Quick ideas ⚡</div>
        </div>
      </section>

      <section className="lp-section lp-personalize" aria-label="Personalization">
        <h2 className="lp-section__title">Make it yours</h2>
        <div className="lp-personalize__box">
          <ul className="lp-checklist">
            <li>✔ Create your own categories</li>
            <li>✔ Add personal ideas</li>
            <li>✔ Build your custom experience</li>
          </ul>
          <div className="lp-personalize__quote">“Your life, your choices — just easier.”</div>
        </div>
      </section>

      <section className="lp-section lp-cta" aria-label="Call to action">
        <h2 className="lp-cta__title">Stop overthinking. Start doing.</h2>
        <p className="lp-cta__text">No login required. Just pick and go.</p>
        <button className="lp-landing__ctaPrimary" onClick={onStart}>
          Try LuckPick
        </button>
      </section>
    </main>
  );
};

export default Landing;
