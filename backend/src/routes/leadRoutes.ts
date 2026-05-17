import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import { validateCreateLead } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', validateCreateLead, LeadController.createLead);
router.get('/', LeadController.getLeads);
router.get('/:id', LeadController.getSingleLead);
router.put('/:id', validateCreateLead, LeadController.updateLead);
router.delete('/:id', roleMiddleware(['admin']), LeadController.deleteLead);

export default router;
