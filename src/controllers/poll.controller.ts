import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreatePollRequestBody, CastVoteRequestBody } from '../types/poll';
import { broadcastToPoll } from '../websocket';

const prisma = new PrismaClient();

export const createPoll = async (req: Request<{}, {}, CreatePollRequestBody>, res: Response): Promise<void> => {
  const { question, options, expiresAt } = req.body;

  if (!question || !Array.isArray(options) || options.length < 2 || !expiresAt) {
    res.status(400).json({ error: 'Invalid input' });
  }

  const poll = await prisma.poll.create({
    data: {
      question,
      options,
      expiresAt: new Date(expiresAt),
    }
  });

  res.status(201).json({ id: poll.id });
};

export const castVote = async (
  req: Request<{ id: string }, {}, CastVoteRequestBody>,
  res: Response
): Promise<void> => {
  const pollId = req.params.id;
  const userId = req.user?.userId;
  const { option } = req.body;

  if (!userId || !option) {
    res.status(400).json({ error: 'Missing userId or option' });
    return;
  }

  try {
    await prisma.vote.create({
      data: { userId, pollId, option }
    });
    // After vote is stored, send updated tally
const poll = await prisma.poll.findUnique({
  where: { id: pollId },
  include: { votes: true }
});

if (poll) {
  const tally = poll.options.reduce((acc: Record<string, number>, option: string) => {
    acc[option] = poll.votes.filter(v => v.option === option).length;
    return acc;
  }, {} as Record<string, number>);

  broadcastToPoll(pollId, { pollId, tally });
}
    res.json({ message: 'Vote recorded' });
  } catch {
    res.status(409).json({ error: 'User already voted' });
  }
};

export const getPoll = async (
  req: Request,
  res: Response
): Promise<void> => {
  const poll = await prisma.poll.findUnique({
    where: { id: req.params.id },
    include: { votes: true },
  });

  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  const tally = poll.options.reduce((acc: Record<string, number>, option: string) => {
    acc[option] = poll.votes.filter((v: { option: string; }) => v.option === option).length;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    id: poll.id,
    question: poll.question,
    options: poll.options,
    expiresAt: poll.expiresAt,
    tally,
  });
};


export const getAllPolls = async (req: Request, res: Response) => {
  const polls = await prisma.poll.findMany({
    orderBy: {
      createdAt: 'desc',
    }
  });

  res.json(polls);
};
