export default function QuestionHeader({
  questionNumber,
  isStudentTaking,
  points,
}: {
  questionNumber: number;
  isStudentTaking: boolean;
  points: number;
}) {
  return (
    <div className="bg-secondary border border-2 border-dark p-2">
      <span className="fs-4">Question {questionNumber}</span>
      <span className="fs-4 float-end">{`${points} points`}</span>
    </div>
  );
}
