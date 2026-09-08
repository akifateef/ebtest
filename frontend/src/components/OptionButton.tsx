import type { QuestionOption } from "../types";

interface Props {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  answered: boolean;
  onClick: () => void;
}

export default function OptionButton({
  option,
  isSelected,
  isCorrect,
  answered,
  onClick,
}: Props) {
  let stateClass = "";
  if (answered) {
    if (isCorrect) stateClass = "option-correct";
    else if (isSelected) stateClass = "option-wrong";
  }

  return (
    <button
      className={`option-btn ${option.image ? "option-btn-image" : ""} ${stateClass} ${
        isSelected ? "option-selected" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      {option.image && (
        <img src={option.image} alt="" className="option-image" />
      )}
      {option.text && <span className="option-text">{option.text}</span>}
    </button>
  );
}
