const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isAdmin } = require('../middleware/auth');
const ContactFormSubmission = require('../models/contactFormSubmission');
const FlightSubmission = require('../models/flightSubmission');
const TourSubmission = require('../models/tourSubmission');
const VisaSubmission = require('../models/visaSubmission');
const PassportSubmission = require('../models/passportSubmission');
const ForexSubmission = require('../models/forexSubmission');
const HoneymoonSubmission = require('../models/honeymoonSubmission');
const DomesticTour = require('../models/domesticTour');
const InternationalTour = require('../models/internationalTour');
const CarouselItem = require('../models/carouselItem');
const PageContent = require('../models/pageContent');

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', isAdmin, async (req, res) => {
    try {
        // Get counts from all collections
        const contactsCount = await ContactFormSubmission.countDocuments();
        const flightsCount = await FlightSubmission.countDocuments();
        const visaCount = await VisaSubmission.countDocuments();
        const passportCount = await PassportSubmission.countDocuments();
        const forexCount = await ForexSubmission.countDocuments();
        const honeymoonCount = await HoneymoonSubmission.countDocuments();
        
        // For domestic and international tours, filter by tourType in TourSubmission
        const domesticToursCount = await TourSubmission.countDocuments({ tourType: 'domestic' });
        const internationalToursCount = await TourSubmission.countDocuments({ tourType: 'international' });

        // Content items counts
        const carouselItemsCount = await CarouselItem.countDocuments();
        const pageContentCount = await PageContent.countDocuments();

        res.json({
            success: true,
            contacts: contactsCount,
            flights: flightsCount,
            visa: visaCount,
            passport: passportCount,
            forex: forexCount,
            honeymoon: honeymoonCount,
            domesticTours: domesticToursCount,
            internationalTours: internationalToursCount,
            carouselItems: carouselItemsCount,
            pageContents: pageContentCount
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

// @route   GET /api/admin/recent-submissions
// @desc    Get recent submissions from all forms
// @access  Private (Admin only)
router.get('/recent-submissions', isAdmin, async (req, res) => {
    try {
        // Get most recent submissions from each collection
        const contacts = await ContactFormSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt')
            .lean();

        const flights = await FlightSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone from to departureDate createdAt')
            .lean();

        const domesticTours = await TourSubmission.find({ tourType: 'domestic' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone destination createdAt')
            .lean();

        const internationalTours = await TourSubmission.find({ tourType: 'international' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone destination createdAt')
            .lean();

        const visas = await VisaSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone destination visaType createdAt')
            .lean();

        const passports = await PassportSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone applicationType createdAt')
            .lean();

        const forexes = await ForexSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone serviceType currencyFrom currencyTo createdAt')
            .lean();

        const honeymoons = await HoneymoonSubmission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email phone destination duration budget createdAt')
            .lean();

        // Add type identifier to each document
        const formattedContacts = contacts.map(contact => ({
            id: contact._id,
            name: contact.name,
            email: contact.email,
            type: 'contact',
            createdAt: contact.createdAt
        }));

        const formattedFlights = flights.map(flight => ({
            id: flight._id,
            name: flight.name,
            email: flight.email,
            phone: flight.phone,
            details: `${flight.from} to ${flight.to}`,
            type: 'flight',
            createdAt: flight.createdAt
        }));

        const formattedDomesticTours = domesticTours.map(tour => ({
            id: tour._id,
            name: tour.name,
            email: tour.email,
            phone: tour.phone,
            details: tour.destination,
            type: 'domestic',
            createdAt: tour.createdAt
        }));

        const formattedInternationalTours = internationalTours.map(tour => ({
            id: tour._id,
            name: tour.name,
            email: tour.email,
            phone: tour.phone,
            details: tour.destination,
            type: 'international',
            createdAt: tour.createdAt
        }));

        const formattedVisas = visas.map(visa => ({
            id: visa._id,
            name: visa.name,
            email: visa.email,
            phone: visa.phone,
            details: `${visa.destination} (${visa.visaType})`,
            type: 'visa',
            createdAt: visa.createdAt
        }));

        const formattedPassports = passports.map(passport => ({
            id: passport._id,
            name: passport.name,
            email: passport.email,
            phone: passport.phone,
            details: passport.applicationType,
            type: 'passport',
            createdAt: passport.createdAt
        }));

        const formattedForexes = forexes.map(forex => ({
            id: forex._id,
            name: forex.name,
            email: forex.email,
            phone: forex.phone,
            details: `${forex.currencyFrom} to ${forex.currencyTo}`,
            type: 'forex',
            createdAt: forex.createdAt
        }));

        const formattedHoneymoons = honeymoons.map(honeymoon => ({
            id: honeymoon._id,
            name: honeymoon.name,
            email: honeymoon.email,
            phone: honeymoon.phone,
            details: `${honeymoon.destination} (${honeymoon.duration})`,
            type: 'honeymoon',
            createdAt: honeymoon.createdAt
        }));

        // Combine all submissions and sort by date (newest first)
        const allSubmissions = [
            ...formattedContacts,
            ...formattedFlights,
            ...formattedDomesticTours,
            ...formattedInternationalTours,
            ...formattedVisas,
            ...formattedPassports,
            ...formattedForexes,
            ...formattedHoneymoons
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Return the 10 most recent submissions
        res.json({
            success: true,
            submissions: allSubmissions.slice(0, 10)
        });
    } catch (err) {
        console.error('Error fetching recent submissions:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching recent submissions'
        });
    }
});

// @route   GET /api/admin/submission/:type/:id
// @desc    Get detailed information about a specific submission
// @access  Private (Admin only)
router.get('/submission/:type/:id', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        let submission;

        // Based on type, query the appropriate collection
        switch (type) {
            case 'contact':
                submission = await ContactFormSubmission.findById(id);
                break;
            case 'flight':
                submission = await FlightSubmission.findById(id);
                break;
            case 'domestic':
            case 'international':
                submission = await TourSubmission.findById(id);
                // Verify tour type matches
                if (submission && submission.tourType !== type) {
                    return res.status(400).json({
                        success: false,
                        message: 'Tour type mismatch'
                    });
                }
                break;
            case 'visa':
                submission = await VisaSubmission.findById(id);
                break;
            case 'passport':
                submission = await PassportSubmission.findById(id);
                break;
            case 'forex':
                submission = await ForexSubmission.findById(id);
                break;
            case 'honeymoon':
                submission = await HoneymoonSubmission.findById(id);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid submission type'
                });
        }

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            data: submission
        });
    } catch (err) {
        console.error('Error fetching submission details:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching submission details'
        });
    }
});

// @route   GET /api/admin/submissions/:type
// @desc    Get all submissions of a specific type
// @access  Private (Admin only)
router.get('/submissions/:type', isAdmin, async (req, res) => {
    try {
        const { type } = req.params;
        let submissions;

        // Based on type, query the appropriate collection
        switch (type) {
            case 'contact':
                submissions = await ContactFormSubmission.find().sort({ createdAt: -1 });
                break;
            case 'flight':
                submissions = await FlightSubmission.find().sort({ createdAt: -1 });
                break;
            case 'domestic':
                submissions = await TourSubmission.find({ tourType: 'domestic' }).sort({ createdAt: -1 });
                break;
            case 'international':
                submissions = await TourSubmission.find({ tourType: 'international' }).sort({ createdAt: -1 });
                break;
            case 'visa':
                submissions = await VisaSubmission.find().sort({ createdAt: -1 });
                break;
            case 'passport':
                submissions = await PassportSubmission.find().sort({ createdAt: -1 });
                break;
            case 'forex':
                submissions = await ForexSubmission.find().sort({ createdAt: -1 });
                break;
            case 'honeymoon':
                submissions = await HoneymoonSubmission.find().sort({ createdAt: -1 });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid submission type'
                });
        }

        res.json({
            success: true,
            submissions
        });
    } catch (err) {
        console.error(`Error fetching ${req.params.type} submissions:`, err.message);
        res.status(500).json({ 
            success: false,
            message: `Server error while fetching ${req.params.type} submissions`
        });
    }
});

// @route   PUT /api/admin/submission/:type/:id
// @desc    Update status of a submission
// @access  Private (Admin only)
router.put('/submission/:type/:id', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;
        
        if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        let submission;
        let model;

        // Based on type, determine the model to use
        switch (type) {
            case 'contact':
                model = ContactFormSubmission;
                break;
            case 'flight':
                model = FlightSubmission;
                break;
            case 'domestic':
            case 'international':
                model = TourSubmission;
                break;
            case 'visa':
                model = VisaSubmission;
                break;
            case 'passport':
                model = PassportSubmission;
                break;
            case 'forex':
                model = ForexSubmission;
                break;
            case 'honeymoon':
                model = HoneymoonSubmission;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid submission type'
                });
        }

        // Update the submission status
        submission = await model.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            data: submission
        });
    } catch (err) {
        console.error('Error updating submission status:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating submission status'
        });
    }
});

// @route   GET /api/admin/submissions/contact
// @desc    Get all contact form submissions
// @access  Private (Admin only)
router.get('/submissions/contact', isAdmin, async (req, res) => {
    try {
        // Get submissions with pagination options
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Get filter options
        const status = req.query.status;
        const search = req.query.search;
        
        // Build query
        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get total count for pagination
        const total = await ContactFormSubmission.countDocuments(query);
        
        // Get submissions
        const submissions = await ContactFormSubmission.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        res.json({
            success: true,
            submissions,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching contact submissions:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching contact submissions'
        });
    }
});

// @route   GET /api/admin/submission/contact/:id
// @desc    Get a specific contact form submission
// @access  Private (Admin only)
router.get('/submission/contact/:id', isAdmin, async (req, res) => {
    try {
        const submission = await ContactFormSubmission.findById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ 
                success: false,
                message: 'Submission not found'
            });
        }
        
        res.json({
            success: true,
            submission
        });
    } catch (err) {
        console.error('Error fetching submission:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching submission'
        });
    }
});

// @route   PUT /api/admin/submission/contact/:id/status
// @desc    Update a contact submission's status
// @access  Private (Admin only)
router.put('/submission/contact/:id/status', isAdmin, async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        // Validate status
        if (!['new', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid status value'
            });
        }
        
        // Find and update the submission
        const submission = await ContactFormSubmission.findById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ 
                success: false,
                message: 'Submission not found'
            });
        }
        
        submission.status = status;
        submission.notes = notes;
        
        await submission.save();
        
        res.json({
            success: true,
            message: 'Submission status updated',
            submission
        });
    } catch (err) {
        console.error('Error updating submission status:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating submission'
        });
    }
});

// @route   DELETE /api/admin/submission/contact/:id
// @desc    Delete a contact submission
// @access  Private (Admin only)
router.delete('/submission/contact/:id', isAdmin, async (req, res) => {
    try {
        const result = await ContactFormSubmission.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ 
                success: false,
                message: 'Submission not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting submission:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting submission'
        });
    }
});

module.exports = router; 