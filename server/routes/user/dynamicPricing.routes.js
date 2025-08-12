import express from 'express';
import { calculateDynamicPrice, getPricingFactors } from '../../controllers/user/dynamicPricing.controller.js';
import { validatePricingCalculation } from '../../middleware/validators/user/dynamicPricingValidator.js';
import authMiddleware from '../../middleware/jwt/user.middleware.js';

const router = express.Router();

// Calculate dynamic price for a booking
router.post('/calculate', authMiddleware, validatePricingCalculation, calculateDynamicPrice);

// Get pricing factors information
router.get('/factors', getPricingFactors);

export default router;
