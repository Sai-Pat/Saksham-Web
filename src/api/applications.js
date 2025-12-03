import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/client';
import kpiData from '../../mock-data/kpi-sample.json';

const SIMULATED_DELAY = 300;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getApplications = async (filters = {}) => {
    try {
        const citizensRef = collection(db, 'citizens');
        const querySnapshot = await getDocs(citizensRef);
        
        let data = querySnapshot.docs.map(doc => {
            const citizen = doc.data();
            return {
                id: doc.id,
                applicantName: citizen.name || 'Unknown',
                type: 'Beneficiary', // Default type as it's not in citizen data
                submissionDate: citizen.updatedAt ? new Date(citizen.updatedAt.seconds * 1000).toISOString().split('T')[0] : 'N/A',
                location: citizen.address || 'N/A',
                status: citizen.fully_verified_beneficiary ? 'approved' : 'pending',
                ...citizen // Include all other citizen data
            };
        });

        if (filters.status) {
            data = data.filter(app => app.status === filters.status);
        }
        
        return data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
};

export const getApplication = async (id) => {
    // Re-using getApplications for simplicity, in a real app you might fetch a single doc
    const apps = await getApplications();
    return apps.find(app => app.id === id);
};

export const getCitizenDocuments = async (citizenId) => {
    try {
        const docsRef = collection(db, `citizens/${citizenId}/documents`);
        const querySnapshot = await getDocs(docsRef);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.custom_name || data.type || doc.id,
                url: data.document_url || '#',
                status: data.status || 'attention', // 'verified', 'rejected', 'attention'
                rejectionReason: data.rejection_reason || '',
                type: data.type,
                uploadDate: data.upload_details?.created_at || 'Recent'
            };
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
};

export const updateDocumentStatus = async (citizenId, documentId, status, reason = '') => {
    try {
        // Dynamic import to avoid circular dependency issues if any, 
        // though here we just need doc and updateDoc from firestore
        const { doc, updateDoc, collection, addDoc } = await import('firebase/firestore');
        const docRef = doc(db, `citizens/${citizenId}/documents/${documentId}`);
        
        console.log(`[DEBUG] Updating document ${documentId} to status: ${status}`);

        const updateData = {
            status: status,
            rejection_reason: reason,
            verified_by_officer: status !== 'attention', // Reset if status is 'attention'
            verified_at: new Date().toISOString(),
            "upload_details.data.success": status // Update nested success field as requested
        };

        await updateDoc(docRef, updateData);
        console.log(`[DEBUG] Document update successful:`, updateData);

        // If rejected, create a notification for the user
        if (status === 'rejected') {
            console.log(`[DEBUG] Attempting to create notification for citizen: ${citizenId}`);
            const notificationsPath = `citizens/${citizenId}/notifications`;
            console.log(`[DEBUG] Collection Path: ${notificationsPath}`);
            
            const notificationsRef = collection(db, notificationsPath);
            const notificationData = {
                title: "Document Rejected",
                message: reason,
                reason: reason,
                type: "document_rejection",
                related_document_id: documentId,
                action_required: true,
                created_by: "Officer",
                aadhaar: citizenId, // Added Aadhaar number as requested
                created_at: new Date().toISOString(),
                read: false
            };
            console.log(`[DEBUG] Notification Data:`, notificationData);

            try {
                const docRef = await addDoc(notificationsRef, notificationData);
                console.log(`[DEBUG] Notification created successfully with ID: ${docRef.id}`);
            } catch (innerError) {
                console.error(`[DEBUG] Failed to create notification:`, innerError);
            }
        }
        
        return { success: true };
    } catch (error) {
        console.error("Error updating document status:", error);
        return { success: false, error };
    }
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
