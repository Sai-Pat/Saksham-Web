import applicationsData from '../../mock-data/applications.json';
import kpiData from '../../mock-data/kpi-sample.json';

const SIMULATED_DELAY = 300;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getApplications = async (filters = {}) => {
    await delay(SIMULATED_DELAY);
    let data = [...applicationsData];
    if (filters.status) {
        data = data.filter(app => app.status === filters.status);
    }
    return data;
};

export const getApplication = async (id) => {
    await delay(SIMULATED_DELAY);
    return applicationsData.find(app => app.id === id);
};

export const approveApplication = async (id, payload) => {
    await delay(SIMULATED_DELAY);
    console.log(`Approved application ${id}`, payload);
    return { success: true, id };
};

export const rejectApplication = async (id, payload) => {
    await delay(SIMULATED_DELAY);
    console.log(`Rejected application ${id}`, payload);
    return { success: true, id };
};

export const scheduleVisit = async (payload) => {
    await delay(SIMULATED_DELAY);
    console.log(`Scheduled visit`, payload);
    return { success: true };
};

export const getKPIs = async () => {
    await delay(SIMULATED_DELAY);
    return kpiData;
};
