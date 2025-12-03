import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateScheme() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Initial State with all potential fields for all domains
    const [formData, setFormData] = useState({
        scheme_id: '',
        title: '',
        short_description: '',
        full_description: '',
        category: 'AGRICULTURE', // Default
        sub_category: '',
        eligibility: {
            age_min: 18,
            land_ownership_required: false,
            required_documents: [],
            min_members: 0 // For Cooperatives
        },
        target_group: [],
        sc_beneficiary_percent: 100,
        funding_type: 'CENTRAL+STATE',
        funds_allocated: 0,
        subsidy_percent: 0,
        implementing_agency: '',
        start_date: '',
        end_date: '',
        status: 'ACTIVE',
        application_process: {
            mode: ['ONLINE'],
            online_portal: '',
            offline_center_address: '', // For Offline mode
            expected_processing_days: 30
        },
        documents_required: [],
        locations: [{ state: 'Maharashtra', district: '' }],

        // Domain Specific Fields (Initialized to defaults)
        // Agriculture
        inputs_provided: { seeds: false, seedlings: false, fertilizers: false, pesticides: false },
        soil_reclamation_methods: [],
        // Horticulture
        plantation_species: [],
        nursery_grant_per_unit: 0,
        market_linkage_support: false,
        // Minor Irrigation
        irrigation_types: [],
        govt_subsidy_per_unit: 0,
        min_beneficiary_group_size: 0,
        // Animal Husbandry
        livestock_types: [],
        unit_size_options: [], // We'll handle as simple text or array for now
        veterinary_support: false,
        // Fisheries
        pond_construction_support: false,
        gear_support: false,
        training_days: 0,
        // Food Processing
        processing_types: [],
        machinery_grant_max: 0,
        // Forestry
        planting_species: [], // Same as plantation_species but different key in JSON
        saplings_per_beneficiary: 0,
        // Handicrafts
        artisan_types: [],
        seed_capital_per_unit: 0,
        training_modules: [],
        // ISB
        subdomains: [],
        loan_linkage: false,
        working_capital_limit: 0,
        business_plan_required: false,
        // Cooperatives
        cooperative_type: '',
        min_members_required: 0,
        working_capital_assistance: 0,
        training_in_coop_mgmt: false,

        beneficiaries_target: 0,
        beneficiaries_enrolled: 0,
        attachments: [],
        contact: {
            name: '',
            phone: '',
            email: ''
        },
        created_by: 'admin_100',
        version: 1
    });

    const categories = [
        "AGRICULTURE",
        "HORTICULTURE",
        "MINOR_IRRIGATION",
        "ANIMAL_HUSBANDARY",
        "FISHERIES",
        "FOOD_PROCESSING",
        "FORESTRY",
        "HANDICRAFTS",
        "ISB",
        "COOPERATIVES"
    ];

    // Helper for handling nested changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    // Helper for array fields (comma separated input)
    const handleArrayChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.split(',').map(item => item.trim())
        }));
    };

    const handleNestedArrayChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value.split(',').map(item => item.trim())
            }
        }));
    };

    const handleLocationChange = (index, field, value) => {
        const newLocations = [...formData.locations];
        newLocations[index][field] = value;
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, { state: 'Maharashtra', district: '' }]
        }));
    };

    const removeLocation = (index) => {
        const newLocations = formData.locations.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const schemesRef = collection(db, "data", "qo3JakPyOUWzdEOFYWbv", "Schemes");

            // Clean up data based on category before saving? 
            // For now, we save everything, or we could filter. 
            // Saving everything is safer for now to avoid losing data if they switch categories back and forth.

            const dataToSave = {
                ...formData,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                // Numeric conversions
                eligibility: {
                    ...formData.eligibility,
                    age_min: Number(formData.eligibility.age_min),
                    min_members: Number(formData.eligibility.min_members)
                },
                sc_beneficiary_percent: Number(formData.sc_beneficiary_percent),
                funds_allocated: Number(formData.funds_allocated),
                subsidy_percent: Number(formData.subsidy_percent),
                application_process: {
                    ...formData.application_process,
                    expected_processing_days: Number(formData.application_process.expected_processing_days)
                },
                beneficiaries_target: Number(formData.beneficiaries_target),
                beneficiaries_enrolled: Number(formData.beneficiaries_enrolled),
                // Domain specific numeric conversions
                nursery_grant_per_unit: Number(formData.nursery_grant_per_unit),
                govt_subsidy_per_unit: Number(formData.govt_subsidy_per_unit),
                min_beneficiary_group_size: Number(formData.min_beneficiary_group_size),
                training_days: Number(formData.training_days),
                machinery_grant_max: Number(formData.machinery_grant_max),
                saplings_per_beneficiary: Number(formData.saplings_per_beneficiary),
                seed_capital_per_unit: Number(formData.seed_capital_per_unit),
                working_capital_limit: Number(formData.working_capital_limit),
                min_members_required: Number(formData.min_members_required),
                working_capital_assistance: Number(formData.working_capital_assistance)
            };

            await addDoc(schemesRef, dataToSave);

            setSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to create scheme. " + err.message);
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    const renderDomainFields = () => {
        switch (formData.category) {
            case 'AGRICULTURE':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Inputs Provided</label>
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(formData.inputs_provided).map(key => (
                                    <div key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.inputs_provided[key]}
                                            onChange={(e) => handleNestedChange('inputs_provided', key, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900 capitalize">{key}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Reclamation Methods (comma separated)</label>
                            <input type="text" value={formData.soil_reclamation_methods.join(', ')} onChange={(e) => handleArrayChange('soil_reclamation_methods', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </>
                );
            case 'HORTICULTURE':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Species (comma separated)</label>
                            <input type="text" value={formData.plantation_species.join(', ')} onChange={(e) => handleArrayChange('plantation_species', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nursery Grant Per Unit (₹)</label>
                            <input type="number" name="nursery_grant_per_unit" value={formData.nursery_grant_per_unit} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="market_linkage_support" checked={formData.market_linkage_support} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Market Linkage Support</label>
                        </div>
                    </div>
                );
            case 'MINOR_IRRIGATION':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Types (comma separated)</label>
                            <input type="text" value={formData.irrigation_types.join(', ')} onChange={(e) => handleArrayChange('irrigation_types', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Govt Subsidy Per Unit (₹)</label>
                            <input type="number" name="govt_subsidy_per_unit" value={formData.govt_subsidy_per_unit} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Beneficiary Group Size</label>
                            <input type="number" name="min_beneficiary_group_size" value={formData.min_beneficiary_group_size} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                );
            case 'ANIMAL_HUSBANDARY':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Livestock Types (comma separated)</label>
                            <input type="text" value={formData.livestock_types.join(', ')} onChange={(e) => handleArrayChange('livestock_types', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="veterinary_support" checked={formData.veterinary_support} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Veterinary Support</label>
                        </div>
                    </div>
                );
            case 'FISHERIES':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="pond_construction_support" checked={formData.pond_construction_support} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Pond Construction Support</label>
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="gear_support" checked={formData.gear_support} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Gear Support</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Training Days</label>
                            <input type="number" name="training_days" value={formData.training_days} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                );
            case 'FOOD_PROCESSING':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Processing Types (comma separated)</label>
                            <input type="text" value={formData.processing_types.join(', ')} onChange={(e) => handleArrayChange('processing_types', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Machinery Grant Max (₹)</label>
                            <input type="number" name="machinery_grant_max" value={formData.machinery_grant_max} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                );
            case 'FORESTRY':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Planting Species (comma separated)</label>
                            <input type="text" value={formData.planting_species.join(', ')} onChange={(e) => handleArrayChange('planting_species', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Saplings Per Beneficiary</label>
                            <input type="number" name="saplings_per_beneficiary" value={formData.saplings_per_beneficiary} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                );
            case 'HANDICRAFTS':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Artisan Types (comma separated)</label>
                            <input type="text" value={formData.artisan_types.join(', ')} onChange={(e) => handleArrayChange('artisan_types', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seed Capital Per Unit (₹)</label>
                            <input type="number" name="seed_capital_per_unit" value={formData.seed_capital_per_unit} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Training Modules (comma separated)</label>
                            <input type="text" value={formData.training_modules.join(', ')} onChange={(e) => handleArrayChange('training_modules', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                );
            case 'ISB':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subdomains (comma separated)</label>
                            <input type="text" value={formData.subdomains.join(', ')} onChange={(e) => handleArrayChange('subdomains', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Working Capital Limit (₹)</label>
                            <input type="number" name="working_capital_limit" value={formData.working_capital_limit} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="loan_linkage" checked={formData.loan_linkage} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Loan Linkage</label>
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="business_plan_required" checked={formData.business_plan_required} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Business Plan Required</label>
                        </div>
                    </div>
                );
            case 'COOPERATIVES':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cooperative Type</label>
                            <input type="text" name="cooperative_type" value={formData.cooperative_type} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Members Required</label>
                            <input type="number" name="min_members_required" value={formData.min_members_required} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Working Capital Assistance (₹)</label>
                            <input type="number" name="working_capital_assistance" value={formData.working_capital_assistance} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center pt-6">
                            <input type="checkbox" name="training_in_coop_mgmt" checked={formData.training_in_coop_mgmt} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Training in Coop Mgmt</label>
                        </div>
                    </div>
                );
            default:
                return <p className="text-gray-500 text-sm">Select a category to see specific fields.</p>;
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
                                <h1 className="text-lg font-bold text-govt-text leading-tight">Admin Portal</h1>
                                <p className="text-xs text-gray-500 font-medium">Ministry of Social Justice and Empowerment</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-sm font-medium text-govt-blue-dark hover:text-blue-700 flex items-center gap-1"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-govt-text">Create New Scheme</h1>
                    <p className="text-gray-600 mt-1">Define parameters for a new welfare scheme.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">Scheme created successfully!</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme ID</label>
                                <input type="text" name="scheme_id" value={formData.scheme_id} onChange={handleChange} required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="e.g., agri_organic_2025_001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <input type="text" name="short_description" value={formData.short_description} onChange={handleChange} required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                <textarea name="full_description" value={formData.full_description} onChange={handleChange} rows="3" required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                <input type="text" name="sub_category" value={formData.sub_category} onChange={handleChange} required className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </section>

                    {/* Domain Specific Fields */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Domain Specific Details ({formData.category.replace(/_/g, ' ')})</h2>
                        {renderDomainFields()}
                    </section>

                    {/* Eligibility & Target */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Eligibility & Target Group</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
                                <input type="number" value={formData.eligibility.age_min} onChange={(e) => handleNestedChange('eligibility', 'age_min', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex items-center pt-6">
                                <input type="checkbox" checked={formData.eligibility.land_ownership_required} onChange={(e) => handleNestedChange('eligibility', 'land_ownership_required', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">Land Ownership Required</label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents (comma separated)</label>
                                <input type="text" value={formData.eligibility.required_documents.join(', ')} onChange={(e) => handleNestedArrayChange('eligibility', 'required_documents', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="SC_certificate, Aadhar, Land_record" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Group (comma separated)</label>
                                <input type="text" value={formData.target_group.join(', ')} onChange={(e) => handleArrayChange('target_group', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="SC_FARMERS, WOMEN" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SC Beneficiary %</label>
                                <input type="number" name="sc_beneficiary_percent" value={formData.sc_beneficiary_percent} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </section>

                    {/* Funding & Timeline */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Funding & Timeline</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Type</label>
                                <select name="funding_type" value={formData.funding_type} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                    <option value="CENTRAL">Central</option>
                                    <option value="STATE">State</option>
                                    <option value="CENTRAL+STATE">Central + State</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Funds Allocated (₹)</label>
                                <input type="number" name="funds_allocated" value={formData.funds_allocated} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subsidy %</label>
                                <input type="number" name="subsidy_percent" value={formData.subsidy_percent} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Implementing Agency</label>
                                <input type="text" name="implementing_agency" value={formData.implementing_agency} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Application Process */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Application Process</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                                <select
                                    value={formData.application_process.mode[0]}
                                    onChange={(e) => handleNestedArrayChange('application_process', 'mode', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                    <option value="ONLINE,OFFLINE">Both</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Processing Days</label>
                                <input type="number" value={formData.application_process.expected_processing_days} onChange={(e) => handleNestedChange('application_process', 'expected_processing_days', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            {formData.application_process.mode.includes('ONLINE') && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Online Portal URL</label>
                                    <input type="url" value={formData.application_process.online_portal} onChange={(e) => handleNestedChange('application_process', 'online_portal', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                            )}
                            {formData.application_process.mode.includes('OFFLINE') && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Offline Center Address</label>
                                    <input type="text" value={formData.application_process.offline_center_address} onChange={(e) => handleNestedChange('application_process', 'offline_center_address', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Locations */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-govt-blue-dark">Target Locations</h2>
                            <button type="button" onClick={addLocation} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Location</button>
                        </div>
                        {formData.locations.map((loc, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 relative">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input type="text" value={loc.state} onChange={(e) => handleLocationChange(index, 'state', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <input type="text" value={loc.district} onChange={(e) => handleLocationChange(index, 'district', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {formData.locations.length > 1 && (
                                    <button type="button" onClick={() => removeLocation(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Contact Info */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-govt-blue-dark mb-4 border-b pb-2">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                <input type="text" value={formData.contact.name} onChange={(e) => handleNestedChange('contact', 'name', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" value={formData.contact.phone} onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={formData.contact.email} onChange={(e) => handleNestedChange('contact', 'email', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-govt-blue-light text-white font-medium rounded-lg hover:bg-govt-blue-dark transition-colors shadow-sm disabled:opacity-70"
                        >
                            {loading ? 'Creating Scheme...' : 'Create Scheme'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
