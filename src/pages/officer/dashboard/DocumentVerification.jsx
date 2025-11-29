import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { getApplications, approveApplication, rejectApplication } from '../../../api/applications';

const DocumentVerification = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalType, setModalType] = useState(null); // 'approve' | 'reject' | 'check'
    const [discrepancy, setDiscrepancy] = useState('');

    // Mock document data with AI verification status
    const mockDocuments = [
        { id: 1, name: 'Aadhaar Card', status: 'verified', url: '#' },
        { id: 2, name: 'Income Certificate', status: 'verified', url: '#' },
        { id: 3, name: 'Caste Certificate', status: 'attention', url: '#' },
        { id: 4, name: 'Residence Proof', status: 'verified', url: '#' },
        { id: 5, name: 'Bank Passbook', status: 'attention', url: '#' },
    ];

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        getApplications({ status: 'pending' }).then(setApplications);
    };

    const handleAction = (app, type) => {
        setSelectedApp(app);
        setModalType(type);
        setDiscrepancy('');
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedApp(null);
        setDiscrepancy('');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 md:p-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-green-600 to-green-700 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-saffron-600 to-green-700 bg-clip-text text-transparent">
                            {t('actions.verify_docs')}
                        </h1>
                        <p className="text-black text-sm md:text-base mt-1 font-medium">Review and verify pending applications</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/officer/dashboard')} className="!text-black">
                        ← Back to Dashboard
                    </Button>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-500 to-green-600">
                                    <th className="p-4 text-left font-bold text-white">Application ID</th>
                                    <th className="p-4 text-left font-bold text-white">Applicant Name</th>
                                    <th className="p-4 text-left font-bold text-white">Type</th>
                                    <th className="p-4 text-left font-bold text-white">Submission Date</th>
                                    <th className="p-4 text-left font-bold text-white">Location</th>
                                    <th className="p-4 text-center font-bold text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app, index) => (
                                    <tr
                                        key={app.id}
                                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 transition-all ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                    >
                                        <td className="p-4 text-black font-semibold">{app.id}</td>
                                        <td className="p-4 text-black font-medium">{app.applicantName}</td>
                                        <td className="p-4 text-black">{app.type}</td>
                                        <td className="p-4 text-black">{app.submissionDate}</td>
                                        <td className="p-4 text-black">{app.location}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleAction(app, 'approve')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(app, 'reject')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    ✕ Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAction(app, 'check')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    👁 Check
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-black font-semibold text-lg">No pending applications</p>
                                                <p className="text-gray-600">All applications have been processed</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Modal */}
            {modalType === 'approve' && selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg border-4 border-green-500">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Approve Application
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6">
                                <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                    <p className="text-black font-semibold mb-2">Application Details:</p>
                                    <p className="text-black"><span className="font-semibold">ID:</span> {selectedApp.id}</p>
                                    <p className="text-black"><span className="font-semibold">Applicant:</span> {selectedApp.applicantName}</p>
                                    <p className="text-black"><span className="font-semibold">Type:</span> {selectedApp.type}</p>
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                    <p className="text-black font-bold text-lg mb-2">⚠️ Confirmation Required</p>
                                    <p className="text-black">Are you sure you want to approve this application? This action will grant benefits to the applicant.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                                >
                                    Yes, Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal with Discrepancy Input */}
            {modalType === 'reject' && selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg border-4 border-red-500">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Reject Application
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6">
                                <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                    <p className="text-black font-semibold mb-2">Application Details:</p>
                                    <p className="text-black"><span className="font-semibold">ID:</span> {selectedApp.id}</p>
                                    <p className="text-black"><span className="font-semibold">Applicant:</span> {selectedApp.applicantName}</p>
                                    <p className="text-black"><span className="font-semibold">Type:</span> {selectedApp.type}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-black font-bold mb-2 text-lg">
                                        Enter Discrepancy Found: <span className="text-red-600">*</span>
                                    </label>
                                    <textarea
                                        value={discrepancy}
                                        onChange={(e) => setDiscrepancy(e.target.value)}
                                        placeholder="Please describe the issues or discrepancies found in the application..."
                                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 text-black font-medium min-h-[120px]"
                                        required
                                    />
                                </div>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <p className="text-black font-semibold">This will notify the applicant about the rejection and the reasons provided.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Check Documents Modal */}
            {modalType === 'check' && selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-4xl border-4 border-orange-500">
                            <div className="bg-gradient-to-r from-orange-500 to-green-600 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    Document Verification - {selectedApp.applicantName}
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6 max-h-[70vh] overflow-y-auto">
                                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border-2 border-orange-200">
                                    <p className="text-black font-semibold mb-1">Application ID: <span className="text-orange-600">{selectedApp.id}</span></p>
                                    <p className="text-black font-semibold">Type: <span className="text-green-600">{selectedApp.type}</span></p>
                                </div>

                                <h4 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-green-600 rounded-full"></span>
                                    Uploaded Documents
                                </h4>

                                <div className="space-y-3">
                                    {mockDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${doc.status === 'verified'
                                                ? 'bg-green-50 border-green-300 hover:border-green-400'
                                                : 'bg-yellow-50 border-yellow-300 hover:border-yellow-400'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${doc.status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}>
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-black font-bold text-lg">{doc.name}</p>
                                                        <p className="text-gray-600 text-sm">PDF Document • 2.4 MB</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {doc.status === 'verified' ? (
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full">
                                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-white font-bold text-sm">AI Verified</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500 rounded-full">
                                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-white font-bold text-sm">AI Attention Needed</span>
                                                        </div>
                                                    )}
                                                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                    <p className="text-black font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        AI Analysis Summary
                                    </p>
                                    <p className="text-black mt-2">3 documents verified successfully. 2 documents require manual attention due to image quality or missing information.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-green-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-green-700 transition-all shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentVerification;
