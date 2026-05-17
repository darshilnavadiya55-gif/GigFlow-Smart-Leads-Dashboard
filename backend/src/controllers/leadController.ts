import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { FilterParams } from '../types/lead';
import { LeadService } from '../services/leadService';

export class LeadController {
  static async createLead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lead = await LeadService.createLead(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Lead created successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeads(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: FilterParams = {
        status: req.query.status as string,
        source: req.query.source as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as 'latest' | 'oldest') || 'latest'
      };

      const result = await LeadService.getLeads(filters, req.user!.userId, req.user!.role);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getSingleLead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lead = await LeadService.getSingleLead(req.params.id, req.user!.userId, req.user!.role);

      if (!lead) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Lead fetched successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lead = await LeadService.updateLead(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );

      if (!lead) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Lead updated successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lead = await LeadService.deleteLead(req.params.id, req.user!.userId, req.user!.role);

      if (!lead) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Lead deleted successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }
}
