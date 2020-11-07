import prompts, { Answers } from 'prompts';
import { Color } from './piece';
import { isFile, isRank, PosFile, Position, PosRank } from './position';

function isValidSquare(square: string): boolean {
  return isFile(square[0]) && isRank(parseInt(square[1]));
}

function parseSquareString(square: string): Position {
  return new Position(square[0] as PosFile, parseInt(square[1]) as PosRank);
}

export async function promptMove(
  color: Color
): Promise<Answers<'confirm' | 'from' | 'to'>> {
  console.log(`It is ${color}'s turn to move.`);
  const response = await prompts([
    {
      type: 'text',
      name: 'from',
      message: 'What is the position of the piece you want to move?',
      validate: isValidSquare,
    },
    {
      type: 'text',
      name: 'to',
      message: 'What is the position you want to move it to?',
      validate: isValidSquare,
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (_, values) =>
        `Confirm move piece at ${values['from']} to ${values['to']}?`,
      format: (prev, values) => {
        return {
          from: parseSquareString(values['from']),
          to: parseSquareString(values['to']),
          confirm: prev,
        };
      },
    },
  ]);
  return response;
}
