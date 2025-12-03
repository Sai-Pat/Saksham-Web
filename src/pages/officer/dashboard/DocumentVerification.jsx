import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getApplications, approveApplication, rejectApplication, getCitizenDocuments, updateDocumentStatus } from '../../../api/applications';

const DocumentVerification = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalType, setModalType] = useState(null); // 'approve' | 'reject' | 'check'
    const [discrepancy, setDiscrepancy] = useState('');
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);

    // State for document rejection
    const [rejectingDocId, setRejectingDocId] = useState(null);
    const [docRejectionReason, setDocRejectionReason] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        getApplications({ status: 'pending' }).then(setApplications);
    };

    const handleAction = async (app, type) => {
        setSelectedApp(app);
        setModalType(type);
        setDiscrepancy('');

        if (type === 'check') {
            setLoadingDocs(true);
            const docs = await getCitizenDocuments(app.id);
            setDocuments(docs);
            setLoadingDocs(false);
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedApp(null);
        setDiscrepancy('');
        setDocuments([]);
        setPreviewDoc(null);
        setRejectingDocId(null);
        setDocRejectionReason('');
    };

    const handleApprove = async () => {
        if (!selectedApp) return;
        await approveApplication(selectedApp.id, {});
        alert(t('messages.approved_success'));
        handleCloseModal();
        loadApplications();
    };

    const handleReject = async () => {
        if (!selectedApp || !discrepancy.trim()) {
            alert('Please enter the discrepancy found');
            return;
        }
        await rejectApplication(selectedApp.id, { reason: discrepancy });
        alert(t('messages.rejected_success'));
        handleCloseModal();
        loadApplications();
    };

    const handleDocumentAction = async (docId, status, reason = '') => {
        if (!selectedApp) return;

        const success = await updateDocumentStatus(selectedApp.id, docId, status, reason);
        if (success) {
            // Update local state
            setDocuments(prevDocs => prevDocs.map(doc =>
                doc.id === docId
                    ? { ...doc, status: status, rejectionReason: reason }
                    : doc
            ));

            if (status === 'rejected') {
                setRejectingDocId(null);
                setDocRejectionReason('');
            }
        } else {
            alert('Failed to update document status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src="/gov.svg" alt="Emblem" className="h-12 w-auto" />
                            <div className="border-l-2 border-gray-200 pl-4">
                                <h1 className="text-lg font-bold text-govt-text leading-tight">Officer Portal</h1>
                                <p className="text-xs text-gray-500 font-medium">Ministry of Social Justice and Empowerment</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/officer/dashboard')}
                            className="text-sm font-medium text-govt-blue-dark hover:text-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-govt-text">{t('actions.verify_docs')}</h1>
                    <p className="text-gray-600 mt-1">Review and verify pending applications for approval.</p>
                </motion.div>

                {/* Applications Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Application ID</th>
                                    <th className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                    <th className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submission Date</th>
                                    <th className="p-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="p-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <AnimatePresence>
                                    {applications.map((app, index) => (
                                        <motion.tr
                                            key={app.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/30 transition-colors group"
                                        >
                                            <td className="p-5 text-sm font-medium text-govt-text">#{app.id.substring(0, 8)}...</td>
                                            <td className="p-5">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                                        {app.applicantName.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{app.applicantName}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm text-gray-700">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                                    {app.type}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-gray-600">{app.submissionDate}</td>
                                            <td className="p-5 text-sm text-gray-600">{app.location}</td>
                                            <td className="p-5 bg-gray-50/30">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleAction(app, 'check')}
                                                        className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm group/btn relative"
                                                        title="View Documents"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(app, 'approve')}
                                                        className="p-2 bg-white border border-gray-200 text-green-600 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all shadow-sm group/btn relative"
                                                        title="Approve Application"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(app, 'reject')}
                                                        className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm group/btn relative"
                                                        title="Reject Application"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-900">No pending applications</p>
                                                <p className="text-sm text-gray-500 mt-1">Great job! You've cleared the queue.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>

            {/* Modals with AnimatePresence */}
            <AnimatePresence>
                {/* Approve Confirmation Modal */}
                {modalType === 'approve' && selectedApp && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                                onClick={handleCloseModal}
                            ></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg"
                            >
                                <div className="bg-green-600 px-6 py-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Approve Application
                                    </h3>
                                </div>
                                <div className="px-6 py-6">
                                    <p className="text-gray-700 mb-4 text-lg">
                                        Approve application for <span className="font-bold text-gray-900">{selectedApp.applicantName}</span>?
                                    </p>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    This action is irreversible. The applicant will be notified immediately.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Confirm Approve
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {modalType === 'reject' && selectedApp && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                                onClick={handleCloseModal}
                            ></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg"
                            >
                                <div className="bg-red-600 px-6 py-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Reject Application
                                    </h3>
                                </div>
                                <div className="px-6 py-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Reason for Rejection <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={discrepancy}
                                        onChange={(e) => setDiscrepancy(e.target.value)}
                                        placeholder="Please provide a detailed reason for rejection..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px] text-sm"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">This reason will be shared with the applicant.</p>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Reject Application
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Check Documents Modal */}
                {modalType === 'check' && selectedApp && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                                onClick={handleCloseModal}
                            ></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-4xl"
                            >
                                <div className="bg-govt-blue-dark px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Document Verification
                                    </h3>
                                    <button onClick={handleCloseModal} className="text-white hover:text-gray-200 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto bg-gray-50">
                                    <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <p className="text-sm text-gray-500">Applicant</p>
                                            <p className="text-lg font-bold text-govt-text">{selectedApp.applicantName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Application ID</p>
                                            <p className="text-lg font-bold text-govt-text">#{selectedApp.id.substring(0, 8)}...</p>
                                        </div>
                                    </div>

                                    {loadingDocs ? (
                                        <div className="flex justify-center p-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {documents.length > 0 ? documents.map((doc, index) => (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`bg-white p-4 rounded-lg border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow ${doc.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                                                >
                                                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-900 capitalize">{doc.name.replace(/_/g, ' ')}</p>
                                                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold border border-cyan-200 flex items-center gap-1">
                                                                <img src="/digi.svg" className="w-4 h-4" />
                                                                Digi-Verified
                                                            </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">Uploaded on {doc.uploadDate}</p>
                                                            {doc.status === 'rejected' && (
                                                                <p className="text-xs text-red-600 font-medium mt-1">Reason: {doc.rejectionReason}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Document Actions */}
                                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                        {rejectingDocId === doc.id ? (
                                                            <div className="flex items-center gap-2 w-full sm:w-auto animate-fadeIn">
                                                                <input
                                                                    type="text"
                                                                    value={docRejectionReason}
                                                                    onChange={(e) => setDocRejectionReason(e.target.value)}
                                                                    placeholder="Reason (Message to user)..."
                                                                    className="text-sm border border-gray-300 rounded px-2 py-1 w-full sm:w-64 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => handleDocumentAction(doc.id, 'rejected', docRejectionReason)}
                                                                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                                    title="Confirm Reject"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectingDocId(null);
                                                                        setDocRejectionReason('');
                                                                    }}
                                                                    className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                                                    title="Cancel"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {doc.status === 'verified' ? (
                                                                    <>
                                                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Verified
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleDocumentAction(doc.id, 'attention')}
                                                                            className="text-xs text-gray-500 hover:text-blue-600 underline ml-2"
                                                                        >
                                                                            Change
                                                                        </button>
                                                                    </>
                                                                ) : doc.status === 'rejected' ? (
                                                                    <>
                                                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
                                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Rejected
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleDocumentAction(doc.id, 'attention')}
                                                                            className="text-xs text-gray-500 hover:text-blue-600 underline ml-2"
                                                                        >
                                                                            Change
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => handleDocumentAction(doc.id, 'verified')}
                                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200 transition-all"
                                                                            title="Mark as Verified"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setRejectingDocId(doc.id)}
                                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
                                                                            title="Reject Document"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                <button
                                                                    onClick={() => setPreviewDoc(doc)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline flex items-center gap-1 ml-2"
                                                                >
                                                                    View
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No documents found for this applicant.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900 mb-1">AI Analysis Summary</h4>
                                            <p className="text-sm text-blue-800">
                                                Please review the documents manually. AI verification is pending for these uploads.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-6 py-2 bg-govt-blue-dark text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Document Preview Modal */}
                {previewDoc && (
                    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
                                onClick={() => setPreviewDoc(null)}
                            ></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all w-full max-w-5xl h-[85vh] flex flex-col"
                            >
                                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center flex-shrink-0">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 capitalize">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {previewDoc.name.replace(/_/g, ' ')}
                                    </h3>
                                    <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 bg-gray-100 p-4 overflow-hidden flex items-center justify-center">
                                    {previewDoc.url.match(/\.(jpeg|jpg|gif|png)$/i) || previewDoc.url.includes('image/upload') ? (
                                        <img
                                            src={previewDoc.url}
                                            alt={previewDoc.name}
                                            className="max-w-full max-h-full object-contain rounded shadow-lg"
                                        />
                                    ) : (
                                        <iframe
                                            src={previewDoc.url}
                                            className="w-full h-full rounded shadow-lg bg-white"
                                            title="Document Preview"
                                        />
                                    )}
                                </div>
                                <div className="bg-white px-6 py-4 flex justify-between items-center border-t border-gray-200 flex-shrink-0">
                                    <a
                                        href={previewDoc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        Open in New Tab
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button
                                        onClick={() => setPreviewDoc(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Close Preview
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentVerification;
