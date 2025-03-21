const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { checkApiKey, isAdmin } = require('../middleware/auth');
const ContactFormSubmission = require('../models/contactFormSubmission');
const FlightSubmission = require('../models/flightSubmission');
const TourSubmission = require('../models/tourSubmission');
const VisaSubmission = require('../models/visaSubmission');
const PassportSubmission = require('../models/passportSubmission');
const ForexSubmission = require('../models/forexSubmission');
const HoneymoonSubmission = require('../models/honeymoonSubmission');

/**
 * @route   POST /api/submissions/contact
 * @desc    Submit a contact form
 * @access  Public (with API key)
 */
router.post(
    '/contact',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('subject', 'Subject is required').not().isEmpty(),
        check('message', 'Message is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { name, email, phone, subject, message } = req.body;

            // Create submission
            const submission = new ContactFormSubmission({
                name,
                email,
                phone,
                subject,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Contact form submitted successfully'
            });
        } catch (error) {
            console.error('Error in contact form submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/flight
 * @desc    Submit a flight inquiry
 * @access  Public (with API key)
 */
router.post(
    '/flight',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('from', 'Departure location is required').not().isEmpty(),
        check('to', 'Destination is required').not().isEmpty(),
        check('departureDate', 'Departure date is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, from, to, departureDate, returnDate, 
                adults, children, travelClass, additionalInfo 
            } = req.body;

            // Create submission
            const submission = new FlightSubmission({
                name,
                email,
                phone,
                from,
                to,
                departureDate,
                returnDate,
                adults: adults || 1,
                children: children || 0,
                travelClass: travelClass || 'economy',
                additionalInfo,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Flight inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in flight inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/tour
 * @desc    Submit a tour inquiry
 * @access  Public (with API key)
 */
router.post(
    '/tour',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('tourType', 'Tour type is required').isIn(['domestic', 'international']),
        check('destination', 'Destination is required').not().isEmpty(),
        check('departureDate', 'Departure date is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, tourType, destination, departureDate, returnDate,
                adults, children, budget, accommodationType, additionalRequirements 
            } = req.body;

            // Create submission
            const submission = new TourSubmission({
                name,
                email,
                phone,
                tourType,
                destination,
                departureDate,
                returnDate,
                adults: adults || 1,
                children: children || 0,
                budget,
                accommodationType: accommodationType || 'standard',
                additionalRequirements,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Tour inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in tour inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/visa
 * @desc    Submit a visa application inquiry
 * @access  Public (with API key)
 */
router.post(
    '/visa',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('destination', 'Destination country is required').not().isEmpty(),
        check('visaType', 'Visa type is required').not().isEmpty(),
        check('travelDate', 'Travel date is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, destination, visaType, 
                travelDate, duration, travelers, message
            } = req.body;

            // Create submission
            const submission = new VisaSubmission({
                name,
                email,
                phone,
                destination,
                visaType,
                travelDate,
                duration,
                travelers,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Visa inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in visa inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/passport
 * @desc    Submit a passport application inquiry
 * @access  Public (with API key)
 */
router.post(
    '/passport',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('applicationType', 'Application type is required').not().isEmpty(),
        check('expectedDate', 'Expected date is required').not().isEmpty(),
        check('urgency', 'Urgency level is required').not().isEmpty(),
        check('numberOfApplicants', 'Number of applicants is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, applicationType, 
                expectedDate, urgency, numberOfApplicants, message
            } = req.body;

            // Create submission
            const submission = new PassportSubmission({
                name,
                email,
                phone,
                applicationType,
                expectedDate,
                urgency,
                numberOfApplicants,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Passport application inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in passport inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/forex
 * @desc    Submit a forex service inquiry
 * @access  Public (with API key)
 */
router.post(
    '/forex',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('serviceType', 'Service type is required').not().isEmpty(),
        check('currencyFrom', 'From currency is required').not().isEmpty(),
        check('currencyTo', 'To currency is required').not().isEmpty(),
        check('amount', 'Amount is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, serviceType, 
                currencyFrom, currencyTo, amount, travelDate, message
            } = req.body;

            // Create submission
            const submission = new ForexSubmission({
                name,
                email,
                phone,
                serviceType,
                currencyFrom,
                currencyTo,
                amount,
                travelDate,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Forex service inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in forex inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

/**
 * @route   POST /api/submissions/honeymoon
 * @desc    Submit a honeymoon package inquiry
 * @access  Public (with API key)
 */
router.post(
    '/honeymoon',
    [
        checkApiKey,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('destination', 'Destination is required').not().isEmpty(),
        check('travelDates', 'Travel dates are required').not().isEmpty(),
        check('duration', 'Duration is required').not().isEmpty(),
        check('budget', 'Budget is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { 
                name, email, phone, weddingDate, destination, otherDestination,
                travelDates, duration, budget, accommodation, message
            } = req.body;

            // Create submission
            const submission = new HoneymoonSubmission({
                name,
                email,
                phone,
                weddingDate,
                destination,
                otherDestination,
                travelDates,
                duration,
                budget,
                accommodation,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Save submission
            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Honeymoon package inquiry submitted successfully'
            });
        } catch (error) {
            console.error('Error in honeymoon inquiry submission:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

module.exports = router; 