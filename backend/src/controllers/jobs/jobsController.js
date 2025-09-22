const Job = require('../../models/jobs/job');


// Create a new job
exports.createJob = async (req, res) => {
    try {
        const { resident,residentID, date, employee, status } = req.body;

        const job = await Job.create({
            resident,
            residentID,
            date,
            employee,
            status
        });
        res.status(201).json({ 
            status: 'success',
            data: job,
            message: 'Job created successfully'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error creating job', error: err });
        console.log(err);
    }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ jobs });
    } catch (err) {

        res.status(500).json({ message: 'Error getting jobs', error: err });
    }
};

// Get a job by its ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if(!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    }catch(err) {
        res.status(500).json({ message: 'Error getting job', error: err });
    }
};

//Update job status and Employee by ID 
exports.updateJobById = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);   
    }catch(err) {
        res.status(500).json({ message: 'Error updating job', error: err });
    }   
};
// Delete a job by its ID
exports.deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if(!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    }catch(err) {
        res.status(500).json({ message: 'Error deleting job', error: err });
    }
};