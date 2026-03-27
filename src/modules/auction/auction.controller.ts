import { Request, Response, NextFunction } from 'express';
import { auctionService } from './auction.service';

export const createAuction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.createAuction(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const startAuction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.startAuction(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addPlayerToPool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.addPlayerToPool(req.params.id as string, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const addTeamToAuction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.addTeam({ auctionId: req.params.id as string, ...req.body });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const placeBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.placeBid(req.params.id as string, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAuctionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auctionService.getAuctionStatus(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
