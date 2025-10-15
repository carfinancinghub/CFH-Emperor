// ----------------------------------------------------------------------
// File: titleService.ts
// Path: backend/src/services/titleService.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for managing the entire vehicle title lifecycle, from
// pending transfers to issue resolution.
//
// @architectural_notes
// - **Single Responsibility**: This service's only job is to manage the
//   business logic for titles. It is decoupled from the API routes.
// - **Ironclad Authorization**: Every function that modifies data includes
//   a critical authorization check to ensure only privileged users (like
//   'title_agent' or 'admin') can perform the action.
//
// @todos
// - @premium:
//   - [ ] ✨ Integrate with a digital signature service (e.g., DocuSign) to manage required title documents directly.
// - @wow:
//   - [ ] 🚀 Build a direct integration with state DMV APIs to submit and track title transfers electronically.
//
// ----------------------------------------------------------------------

import Title from '@/models/Title';
import { IUser, ITitle } from '@/types';
import logger from '@/utils/logger';
import SecurityLogger from '@/services/security/SecurityLogger';

const titleService = {
  async getPendingTransfers(): Promise<ITitle[]> {
    return Title.find({ status: 'pending' }).populate('carId').populate('buyerId');
  },

  async getTitleIssues(): Promise<ITitle[]> {
    return Title.find({ status: { $in: ['missing', 'rejected'] } }).populate('carId');
  },

  async completeTransfer(user: IUser, titleId: string): Promise<ITitle> {
    if (!user.permissions?.includes('can_complete_transfers')) {
      throw new Error('Forbidden: Not authorized to complete transfers.');
    }
    
    const title = await Title.findById(titleId);
    if (!title) throw new Error('Title record not found');
    
    title.status = 'clear';
    await title.save();

    await SecurityLogger.logSecurityEvent('ADMIN_COMPLETED_TRANSFER', 'INFO', {
      adminId: user.id,
      targetTitleId: titleId,
    });
    
    logger.info(`Title transfer ${titleId} completed by ${user.id}`);
    return title;
  },
};

export default titleService;