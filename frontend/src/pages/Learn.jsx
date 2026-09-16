import React from "react";
import { Link } from "react-router-dom";
import { Volume2 } from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { useSpeech } from "../hooks/useSpeech.js";

// Extend this list as more signs are added to the trained model.
// These are illustrative only — see MODEL_SETUP.md for how labels map to
// what the model actually recognizes.
const SIGNS = [
  { name: "HELLO", description: "A friendly open-hand wave used as a greeting." },
  { name: "THANK YOU", description: "Fingers touch the chin, then move forward and down." },
  { name: "YES", description: "A closed fist nods up and down, like a small nod of the head." },
  { name: "NO", description: "Index and middle finger close against the thumb." },
  { name: "PLEASE", description: "A flat hand rubs in a circular motion on the chest." },
  { name: "HELP", description: "One fist rests on an open palm and lifts together." },
  { name: "GOOD MORNING", description: "A flat hand rises from the chest, palm up, like a sunrise." },
];

export default function Learn() {
  const { speak } = useSpeech();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Learn Sign Language</h1>
      <p className="mt-1.5 max-w-xl text-ink-soft">
        Practice these signs in front of the translator to see how recognition
        works. As Signify's model grows, more signs will appear here.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((sign) => (
          <Card key={sign.name} className="flex flex-col p-5">
            <div className="mb-4 flex h-28 items-center justify-center rounded-xl surface-2 text-3xl font-display font-bold text-brand-600">
              {sign.name.slice(0, 2)}
            </div>
            <h3 className="font-display text-base font-semibold text-ink">{sign.name}</h3>
            <p className="mt-1.5 flex-1 text-sm text-ink-soft">{sign.description}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" icon={Volume2} onClick={() => speak(sign.name)}>
                Hear it
              </Button>
              <Button size="sm" variant="outline" as={Link} to="/translator">
                Practice
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
