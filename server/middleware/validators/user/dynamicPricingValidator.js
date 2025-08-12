import { body } from 'express-validator';

export const validatePricingCalculation = [
  body('turfId')
    .notEmpty()
    .withMessage('Turf ID is required')
    .isMongoId()
    .withMessage('Invalid turf ID format'),
  
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .withMessage('Duration must be a number')
    .custom((value) => {
      if (value <= 0 || value > 24) {
        throw new Error('Duration must be between 1 and 24 hours');
      }
      return true;
    }),
  
  body('selectedDate')
    .notEmpty()
    .withMessage('Selected date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Selected date must be in YYYY-MM-DD format')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Cannot book for past dates');
      }
      return true;
    })
];
