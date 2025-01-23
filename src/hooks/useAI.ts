import { useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Board, Position, PieceColor } from '../types/chess';

export function useAI() {
  const model = tf.loadLayersModel('/model/chess_model.json');

  const encodeBoardState = useCallback((board: Board) => {
    // Convert board state to tensor
    const encoded = tf.tensor3d(
      board.map(row =>
        row.map(square =>
          square
            ? [
                square.type === 'p' ? 1 : 0,
                square.type === 'n' ? 1 : 0,
                square.type === 'b' ? 1 : 0,
                square.type === 'r' ? 1 : 0,
                square.type === 'q' ? 1 : 0,
                square.type === 'k' ? 1 : 0,
                square.color === 'w' ? 1 : -1
              ]
            : [0, 0, 0, 0, 0, 0, 0]
        )
      )
    );
    return encoded;
  }, []);

  const getBestMove = useCallback(async (board: Board, color: PieceColor) => {
    const encoded = encodeBoardState(board);
    const prediction = await (await model).predict(encoded);
    
    // Convert prediction to move
    const moveProbs = Array.from(await (prediction as tf.Tensor).data());
    const bestMoveIndex = moveProbs.indexOf(Math.max(...moveProbs));
    
    // Convert index to chess move
    const from = {
      row: Math.floor(bestMoveIndex / 64) % 8,
      col: Math.floor(bestMoveIndex / 8) % 8
    };
    const to = {
      row: Math.floor(bestMoveIndex % 64 / 8),
      col: bestMoveIndex % 8
    };

    return { from, to };
  }, [model, encodeBoardState]);

  const analyzePuzzle = useCallback(async (board: Board, from: Position, to: Position) => {
    const encoded = encodeBoardState(board);
    const moveQuality = await (await model).predict(encoded);
    const score = Array.from(await (moveQuality as tf.Tensor).data())[0];

    return {
      message: score > 0.8
        ? 'Excellent move!'
        : score > 0.6
        ? 'Good move!'
        : score > 0.4
        ? 'Decent move.'
        : 'There might be a better move.',
      score
    };
  }, [model, encodeBoardState]);

  return {
    getBestMove,
    analyzePuzzle
  };
}