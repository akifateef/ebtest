import type { QuestionOption } from "../types";

interface Props {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  answered: boolean;
  revealAnswer: boolean;
  onClick: () => void;
  readOnly?: boolean;
}

export default function OptionButton({
  option,
  isSelected,
  isCorrect,
  answered,
  revealAnswer,
  onClick,
  readOnly = false,
}: Props) {
  let stateClass = "";
  if (answered && revealAnswer) {
    if (isCorrect) stateClass = "option-correct";
    else if (isSelected) stateClass = "option-wrong";
  }

  return (
    <button
      className={`option-btn ${option.image ? "option-btn-image" : ""} ${stateClass} ${
        isSelected ? "option-selected" : ""
      } ${readOnly ? "option-btn-readonly" : ""}`}
      onClick={readOnly ? undefined : onClick}
      type="button"
      dir="ltr"
    >
      {option.image && (
        <img src={option.image} alt="" className="option-image" />
      )}
      {option.text && <span className="option-text">{option.text}</span>}
    </button>
  );
}
