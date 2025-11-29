import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';
import { useOfflineQueue } from '../../../hooks/useOfflineQueue';
import { scheduleVisit, getApplications, approveApplication } from '../../../api/applications';

const FieldEnumerator = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { queue, addToQueue, sync, queueLength } = useOfflineQueue();
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalType, setModalType] = useState(null); // 'schedule' | 'upload' | 'approve'
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scheduleData, setScheduleData] = useState({ place: '', date: '', time: '' });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        getApplications({ status: 'pending' }).then(setApplications);
    };

    const handleAction = (app, type) => {
        setSelectedApp(app);
        setModalType(type);
        setSelectedFile(null);
        setPreviewUrl(null);
        setScheduleData({ place: '', date: '', time: '' });
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedApp(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setScheduleData({ place: '', date: '', time: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadPhoto = () => {
        if (selectedFile && selectedApp) {
            addToQueue({
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                applicationId: selectedApp.id,
                applicantName: selectedApp.applicantName
            });
            alert(`Photo for ${selectedApp.applicantName} added to offline queue`);
            handleCloseModal();
        }
    };

    const handleScheduleSubmit = async () => {
        if (!selectedApp || !scheduleData.place || !scheduleData.date || !scheduleData.time) {
            alert('Please fill in all fields');
            return;
        }
        await scheduleVisit({
            applicationId: selectedApp.id,
            ...scheduleData
        });
        alert(`Field visit scheduled for ${selectedApp.applicantName}`);
        handleCloseModal();
    };

    const handleApprove = async () => {
        if (!selectedApp) return;
        await approveApplication(selectedApp.id, {});
        alert(`Application ${selectedApp.id} approved successfully`);
        handleCloseModal();
        loadApplications();
    };

    const handleSync = async () => {
        await sync();
        alert('Queue synced successfully');
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
                            {t('actions.field_visit')}
                        </h1>
                        <p className="text-black text-sm md:text-base mt-1 font-medium">Manage field visits and offline uploads</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/officer/dashboard')} className="!text-black">
                        ← Back to Dashboard
                    </Button>
                </div>

                {/* Offline Queue Status */}
                <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black">Offline Upload Queue</h3>
                                <p className="text-black font-semibold mt-1">
                                    <span className="text-2xl text-blue-600">{queueLength}</span> items pending sync
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSync}
                            disabled={queueLength === 0}
                            className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg ${queueLength === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5'
                                }`}
                        >
                            🔄 Sync Now
                        </button>
                    </div>
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
                                    <th className="p-4 text-left font-bold text-white">Location</th>
                                    <th className="p-4 text-left font-bold text-white">Submission Date</th>
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
                                        <td className="p-4 text-black">{app.location}</td>
                                        <td className="p-4 text-black">{app.submissionDate}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleAction(app, 'schedule')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    📅 Schedule
                                                </button>
                                                <button
                                                    onClick={() => handleAction(app, 'upload')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    📸 Upload
                                                </button>
                                                <button
                                                    onClick={() => handleAction(app, 'approve')}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    ✓ Approve
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <p className="text-black font-semibold text-lg">No pending applications</p>
                                                <p className="text-gray-600">All field visits have been completed</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Schedule Visit Modal */}
            {modalType === 'schedule' && selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg border-4 border-blue-500">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Schedule Field Visit
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6">
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                    <p className="text-black font-semibold mb-2">Application Details:</p>
                                    <p className="text-black"><span className="font-semibold">ID:</span> {selectedApp.id}</p>
                                    <p className="text-black"><span className="font-semibold">Applicant:</span> {selectedApp.applicantName}</p>
                                    <p className="text-black"><span className="font-semibold">Location:</span> {selectedApp.location}</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-black font-bold mb-2">
                                            Visit Place: <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={scheduleData.place}
                                            onChange={(e) => setScheduleData({ ...scheduleData, place: e.target.value })}
                                            placeholder="Enter visit location address"
                                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-black font-bold mb-2">
                                            Visit Date: <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={scheduleData.date}
                                            onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-black font-bold mb-2">
                                            Visit Time: <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleData.time}
                                            onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black font-medium"
                                        />
                                    </div>
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
                                    onClick={handleScheduleSubmit}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                                >
                                    Schedule Visit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Photo Modal */}
            {modalType === 'upload' && selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:w-full sm:max-w-lg border-4 border-purple-500">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    Upload Field Visit Photo
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6">
                                <div className="mb-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                    <p className="text-black font-semibold mb-2">Application Details:</p>
                                    <p className="text-black"><span className="font-semibold">ID:</span> {selectedApp.id}</p>
                                    <p className="text-black"><span className="font-semibold">Applicant:</span> {selectedApp.applicantName}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-black font-bold mb-2">
                                        Select Photo: <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-60 object-contain rounded" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-16 h-16 mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="mb-2 text-lg font-bold text-black">Click to upload photo</p>
                                                    <p className="text-sm text-gray-600">PNG, JPG or JPEG (MAX. 10MB)</p>
                                                </div>
                                            )}
                                            <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-black font-semibold">Selected: {selectedFile.name}</p>
                                    )}
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                    <p className="text-black font-semibold">📱 Offline Mode: Photo will be queued and synced when online</p>
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
                                    onClick={handleUploadPhoto}
                                    disabled={!selectedFile}
                                    className={`px-6 py-2.5 font-semibold rounded-lg transition-all shadow-lg ${selectedFile
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Add to Queue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    Approve After Field Visit
                                </h3>
                            </div>
                            <div className="bg-white px-6 py-6">
                                <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                    <p className="text-black font-semibold mb-2">Application Details:</p>
                                    <p className="text-black"><span className="font-semibold">ID:</span> {selectedApp.id}</p>
                                    <p className="text-black"><span className="font-semibold">Applicant:</span> {selectedApp.applicantName}</p>
                                    <p className="text-black"><span className="font-semibold">Type:</span> {selectedApp.type}</p>
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                                    <p className="text-black font-bold text-lg mb-2">⚠️ Recheck Required</p>
                                    <p className="text-black">Please confirm that you have:</p>
                                    <ul className="list-disc list-inside mt-2 text-black space-y-1">
                                        <li>Completed the field visit</li>
                                        <li>Verified all documents physically</li>
                                        <li>Uploaded visit photos</li>
                                        <li>Confirmed applicant eligibility</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <p className="text-black font-semibold">This action will approve the application and grant benefits to the applicant.</p>
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
        </div>
    );
};

export default FieldEnumerator;
