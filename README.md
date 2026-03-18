## LuckPick

Spin your day. Choose your adventure.

LuckPick is a fun, interactive React + TypeScript app that helps you make decisions instantly. Spin a wheel, explore activity ideas (walk in the park, bake cookies, call a friend, etc.), and keep a simple history of what you’ve done. Customize your wheels, add your own ideas, and never run out of inspiration.

---

## Features

- **Interactive wheel**: Spin to randomly pick a category.
- **Activity cards**: Show a concrete activity for the chosen category.
- **Custom wheels**: Add your own categories via the Custom Wheel Editor.
- **History list**: See what you’ve spun recently.
- **Frontend only**: Built with React + TypeScript, no backend required.

---

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **State management**: React Context API (`LuckPickContext`)

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. **Open the app**  
   Visit the URL printed in the terminal (typically `http://localhost:5173` for Vite).

---

## How to Use

- **Spin the wheel**: Click the spin button to choose a wheel option.
- **View activity**: See the selected activity in the activity card.
- **Next activity**: Click “Next Activity” to get another idea from the same wheel.
- **Save to history**: Click “Done / Save” to add it to your history list.
- **Customize wheels**: Use the Custom Wheel Editor to add new wheel options.

---

## Folder Structure (simplified)

```text
luckpick/
  public/
  src/
    components/
      Wheel/
      ActivityCard/
      History/
      CustomWheelEditor/
      Header.tsx
      Footer.tsx
    context/
      LuckPickContext.tsx
    App.tsx
    main.tsx
    styles.css
  package.json
  tsconfig.json
```

---

## Future Improvements

- **Social sharing** of spins and results
- **Smarter suggestions** based on past activity
- **Themed wheels** for holidays or special events

---

## License

MIT
