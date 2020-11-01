import prompts from 'prompts';

function validateMoveInput(move: string): string | boolean {
  // the last char is the rank, the prev is the file
  // info before that is related to the piece
  return move;
}

async () => {
  const response = await prompts({
    type: 'text',
    name: 'move',
    message: 'What is your next move?',
    validate: validateMoveInput,
  });
};
