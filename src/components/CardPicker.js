import CitizenPicker from "./CitizenPicker";
import MonsterPicker from "./MonsterPicker";
import DomainPicker from "./DomainPicker";

export default function CardPicker({ category, onSelect, onClose }) {
  if (category === "citizen") {
    return <CitizenPicker onSelect={onSelect} onClose={onClose} />;
  }

  if (category === "monster") {
    return <MonsterPicker onSelect={onSelect} onClose={onClose} />;
  }

  if (category === "domain") {
    return <DomainPicker onSelect={onSelect} onClose={onClose} />;
  }

  return null;
}
