import { Lead } from '../models/Lead';
import { ILead, FilterParams, PaginationMeta, ApiResponse } from '../types/lead';

export class LeadService {
  static async createLead(data: any, userId: string): Promise<ILead> {
    const lead = new Lead({
      ...data,
      createdBy: userId
    });
    return (await lead.save()) as unknown as ILead;
  }

  static async getLeads(
    filters: FilterParams,
    userId: string
  ): Promise<ApiResponse<ILead[]>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { createdBy: userId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Get leads
    const leads = await Lead.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: filters.sortBy === 'oldest' ? 1 : -1 });

    // Get total count
    const totalRecords = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    const pagination: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalRecords,
      recordsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    return {
      success: true,
      statusCode: 200,
      message: 'Leads fetched successfully',
      data: leads as unknown as ILead[],
      pagination
    };
  }

  static async getSingleLead(leadId: string, userId: string): Promise<ILead | null> {
    return (await Lead.findOne({ _id: leadId, createdBy: userId })) as unknown as ILead | null;
  }

  static async updateLead(
    leadId: string,
    data: any,
    userId: string
  ): Promise<ILead | null> {
    return (await Lead.findOneAndUpdate(
      { _id: leadId, createdBy: userId },
      data,
      { new: true, runValidators: true }
    )) as unknown as ILead | null;
  }

  static async deleteLead(leadId: string, userId: string): Promise<ILead | null> {
    return (await Lead.findOneAndDelete({ _id: leadId, createdBy: userId })) as unknown as ILead | null;
  }
}
