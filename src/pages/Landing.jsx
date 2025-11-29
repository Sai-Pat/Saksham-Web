import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Landing = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { i18n } = useTranslation();

    const slides = [
        {
            title: 'Your Gateway to Digital Governance',
            description: 'Access a vast array of government services seamlessly, securely, and with ease. Empowering citizens through technology.',
            image: '/communities.jpg',
        },
        {
            title: 'Simplified Services, Enhanced Experience',
            description: 'From applying for schemes to checking statuses, our platform makes interacting with government services straightforward and efficient.',
            image: '/happy.jpg',
        },
        {
            title: 'Secure and Transparent Transactions',
            description: 'Your data privacy and transaction security are our top priorities. Experience a trusted digital environment.',
            image: '/parliament.jpg',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="min-h-screen bg-hero-gradient font-sans text-dark-text">
            {/* Top Dark Blue Bar */}
            <div className="w-full bg-primary-blue text-white text-xs py-1 px-4 flex justify-between items-center" style={{ height: '0.5cm' }}>
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Ministry of Social Justice and Empowerment</span>
                    <img src="/digital-india-logo.png" alt="Digital India" className="h-4" /> {/* Assuming digital-india-logo.png exists in public */}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex gap-2">
                        <button
                            className={`text-white text-xs ${i18n.language === 'en' ? 'font-bold' : ''}`}
                            onClick={() => changeLanguage('en')}
                        >
                            English
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            className={`text-white text-xs ${i18n.language === 'hi' ? 'font-bold' : ''}`}
                            onClick={() => changeLanguage('hi')}
                        >
                            हिंदी
                        </button>
                    </div>
                    <button className="text-white text-xs flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.488 1.107 1.488 2.09 0 1.077-.71 1.954-1.7 2.39L18.425 15l1.246 1.731a5.955 5.955 0 01-1.489 2.19c-.482.382-1.07.675-1.725.868l-.29.083m-5.423-1.006l1.229 2.124m0 0a.44.44 0 00.113.114.457.457 0 00.124.06.466.466 0 00.16.03l.112-.008.01-.002.003-.002A.53.53 0 0014 21.5c.198 0 .385-.045.53-.124l.002-.003.002-.01l.008-.112a.466.466 0 00.03-.16.457.457 0 00.06-.124.44.44 0 00.114-.113h0zM14 12h.01M12 21.25V1.75M17.616 10.74l-2.039 1.104l.002.016m-.576.81l-2.124 1.229.016.002m.81-.576l-.8-.465" />
                        </svg>
                        Chatbot
                    </button>
                </div>
            </div>

            {/* Main Header */}
            <header className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src="/MargVedha-logo.png" alt="MargVedha Logo" className="h-10 w-10" /> {/* Assuming MargVedha-logo.png exists in public */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-bold text-2xl text-primary-blue"
                    >
                        Saksham
                    </motion.div>
                    <span className="text-medium-text hidden md:block">Digital Governance Platform</span>
                </div>
                <nav className="space-x-4 flex items-center">
                    <Link to="/admin/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary-blue text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-hover transition-colors text-sm font-semibold"
                        >
                            Admin Login
                        </motion.button>
                    </Link>
                    <Link to="/officer/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white border border-primary-blue text-primary-blue px-6 py-2 rounded-lg shadow-md hover:bg-light-blue transition-colors text-sm font-semibold"
                        >
                            Officer Login
                        </motion.button>
                    </Link>
                </nav>
            </header>

            <main>
                {/* HERO CAROUSEL SECTION */}
                <section className="relative w-full overflow-hidden rounded-b-2xl shadow-xl max-w-7xl mx-auto mt-4" style={{ backgroundColor: 'var(--light-blue-accent)' }}>
                    <div className="relative h-[400px] md:h-[500px]">
                        <AnimatePresence initial={false} custom={currentSlide}>
                            {slides.map((slide, index) => (
                                currentSlide === index && (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 flex items-center p-8 md:p-12"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full w-full">
                                            {/* Text Left */}
                                            <div className="flex flex-col justify-center text-left space-y-4">
                                                <h2 className="text-4xl md:text-5xl font-extrabold text-primary-blue leading-tight">
                                                    {slide.title}
                                                </h2>
                                                <p className="text-lg text-medium-text">
                                                    {slide.description}
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="w-fit bg-primary-blue text-white px-8 py-3 rounded-lg shadow-lg hover:bg-primary-hover transition-colors font-semibold"
                                                >
                                                    Explore Services
                                                </motion.button>
                                            </div>
                                            {/* Illustration Right */}
                                            <div className="hidden md:flex justify-center items-center h-full">
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-primary-blue' : 'bg-gray-300 hover:bg-gray-400'}`}
                                ></button>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary-blue hover:text-primary-hover focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary-blue hover:text-primary-hover focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </div>
                </section>
                
                {/* STATS SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-light-blue-accent p-6 rounded-xl border border-border-light shadow-card-shadow text-center"
                        >
                            <p className="text-5xl font-extrabold text-primary-blue">120+</p>
                            <p className="text-medium-text mt-2 text-lg">Total Services</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-light-blue-accent p-6 rounded-xl border border-border-light shadow-card-shadow text-center"
                        >
                            <p className="text-5xl font-extrabold text-primary-blue">50+</p>
                            <p className="text-medium-text mt-2 text-lg">Departments Connected</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-light-blue-accent p-6 rounded-xl border border-border-light shadow-card-shadow text-center"
                        >
                            <p className="text-5xl font-extrabold text-primary-blue">10M+</p>
                            <p className="text-medium-text mt-2 text-lg">Total Users</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-light-blue-accent p-6 rounded-xl border border-border-light shadow-card-shadow text-center"
                        >
                            <p className="text-5xl font-extrabold text-primary-blue">500M+</p>
                            <p className="text-medium-text mt-2 text-lg">Total Transactions</p>
                        </motion.div>
                    </div>
                </section>

                {/* SERVICES BY STATES SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-primary-blue text-center mb-8">Services by States & UTs</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
                              'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
                              'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
                              'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
                              'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                              'Andaman & Nicobar', 'Chandigarh', 'Dadar & Nagar Haveli', 'Daman & Diu',
                              'Delhi', 'Lakshadweep', 'Puducherry', 'Ladakh', 'Jammu & Kashmir'
                        ].map((state, index) => (
                            <motion.div
                                key={state}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                                className="bg-white p-4 rounded-xl border border-border-light text-center cursor-pointer flex flex-col items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm font-semibold text-dark-text">{state}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* BENEFITS OF THE APP SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-primary-blue text-center mb-8">Benefits of Saksham</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[    {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8.25 15.75h7.5A2.25 2.25 0 0018 13.5V6a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 6v7.5a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                ),
                                heading: 'Unified Platform',
                                description: 'All government services, schemes, and information in one easy-to-access location.',
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0118 0Z" />
                                    </svg>
                                ),
                                heading: 'Secure Access',
                                description: 'Robust security measures to protect your personal data and transactions.',
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v.01M12 12v.01M12 18v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM11.25 6a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM11.25 12a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM11.25 18a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                                    </svg>
                                ),
                                heading: '24x7 Availability',
                                description: 'Access government services anytime, anywhere, on any device.',
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l-7.5-7.5m0 0l7.5-7.5M3 13.5h18" />
                                    </svg>
                                ),
                                heading: 'Multi-language Support',
                                description: 'Information and services available in various regional languages for wider reach.',
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                heading: 'Real-time Updates',
                                description: 'Stay informed with the latest notifications and updates on your applications and schemes.',
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 1 00-2 2v10a2 2 0 002 2m0-16a2 2 0 012 2v10a2 2 0 01-2 2m0 0h.01M12 12h.01" />
                                    </svg>
                                ),
                                heading: 'Personalized Experience',
                                description: 'Tailored content and recommendations based on your preferences and needs.',
                            },
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                                className="bg-light-blue-accent p-6 rounded-xl border border-border-light text-center flex flex-col items-center"
                            >
                                {benefit.icon}
                                <h3 className="text-xl font-bold text-dark-text mb-2">{benefit.heading}</h3>
                                <p className="text-medium-text text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CATEGORIES SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-primary-blue text-center mb-8">Explore Services by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[    {
                                name: 'Travel',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Utilities',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17H21l-9-13-9 13h11.337z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Education',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v8" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Transport',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Health',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0112 21a8.987 8.987 0 019-6.738V6.552a8.967 8.967 0 00-6-2.79Z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Finance',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Employment',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6H7.5a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 21h4.5m-10.5-6L2 17.25m0 0l2.25 2.25M2 17.25H4.5m0-6H7.5m-3-6L2 6.75m0 0l2.25-2.25M2 6.75H4.5m10.5-6h.008v.008H15V6h1.5zm1.5 6h.008v.008H18v-1.5H16.5m1.5-6h.008v.008H18V9h-1.5m1.5 6h.008v.008H18V18h-1.5m-4.5 3h.008v.008H13.5V19.5H12M12 21h.008v.008H12z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Legal',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 16.5l-6 6-6-6M12 3v12m0 0l6-6-6-6" />
                                    </svg>
                                ),
                            },
                        ].map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                                className="bg-white p-6 rounded-xl border border-border-light shadow-card-shadow text-center flex flex-col items-center cursor-pointer"
                            >
                                {category.icon}
                                <p className="text-lg font-semibold text-dark-text">{category.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* NEED HELP SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-light-blue p-8 rounded-2xl shadow-card-shadow flex flex-col md:flex-row items-center justify-between text-center md:text-left"
                    >
                        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-blue mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75l4-4.5 4 4.5M12 18.75h.008v.008H12v-.008z" />
                            </svg>
                            <div>
                                <h3 className="text-2xl font-bold text-dark-text">Need Assistance?</h3>
                                <p className="text-medium-text">Our support team is here to help you.</p>
                            </div>
                        </div>
                        <button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary-blue text-white px-8 py-3 rounded-lg shadow-md hover:bg-primary-hover transition-colors font-semibold"
                        >
                            Visit Help Center
                        </button>
                    </motion.div>
                </section>

                {/* DOWNLOAD APP SECTION */}
                <section className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-light-blue rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-card-shadow"
                    >
                        {/* Left Column: Text and Badges */}
                        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary-blue leading-tight mb-4">
                                Download the Saksham App
                            </h2>
                            <p className="text-lg text-medium-text mb-6">
                                Access all government services on the go. Available for both Android and iOS devices.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-4">
                                {/* Google Play Badge */}
                                <a href="#" className="block" aria-label="Download on Google Play">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" />
                                </a>
                                {/* App Store Badge */}
                                <a href="#" className="block" aria-label="Download on Apple App Store">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-12" />
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Phone Mockup */}
                        <div className="md:w-1/2 flex justify-center md:justify-end">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                src="https://via.placeholder.com/300x600/0071CE/FFFFFF?text=App+Screen" 
                                alt="Phone Mockup with App Screen"
                                className="max-h-80 md:max-h-96 object-contain"
                            />
                        </div>
                    </motion.div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="bg-dark-text text-white py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Saksham</h3>
                        <p className="text-sm text-gray-400">
                            Saksham is a digital governance platform designed to bring government services closer to citizens.
                            Our mission is to empower individuals through seamless access to essential services.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Services</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Schemes</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Benefits</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources & Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Resources & Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.016 3.655 9.182 8.438 9.873V14.808h-2.54V12h2.54V9.797c0-2.518 1.493-3.902 3.776-3.902 1.096 0 2.052.196 2.327.283v2.027h-1.22c-1.206 0-1.44.572-1.44 1.411V12h2.89l-.47 2.808h-2.42V21.873C18.345 21.182 22 17.016 22 12c0-5.523-4.477-10-10-10z"/></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M22.46 6c-.843.373-1.751.624-2.703.743.967-.582 1.708-1.503 2.054-2.593-.905.535-1.916.924-2.997 1.134-.855-.908-2.072-1.474-3.414-1.474-2.571 0-4.664 2.093-4.664 4.664 0 .365.042.721.123 1.06C8.683 8.354 5.305 6.643 3.033 3.82c-.378.649-.595 1.399-.595 2.198 0 1.618.824 3.045 2.079 3.874-.764-.025-1.48-.234-2.105-.582v.06c0 2.269 1.611 4.153 3.749 4.582-.392.106-.806.162-1.235.162-.303 0-.598-.03-1.026-.098.6 1.86 2.333 3.215 4.381 3.253-1.603 1.253-3.623 2.001-5.818 2.001-.379 0-.75-.022-1.115-.065C3.313 20.354 5.647 21 8.1 21c9.721 0 15.011-8.05 15.011-15.011 0-.229-.004-.456-.015-.684z"/></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.071 1.17.055 1.805.249 2.227.422.56.236.965.52 1.353.908.388.388.672.793.908 1.353.173.422.367 1.057.422 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.055 1.17-.249 1.805-.422 2.227-.236.56-.52 0-.908 1.353-.388.388-.793.672-1.353.908-.422.173-1.057.367-2.227.422-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.071c-1.17-.055-1.805-.249-2.227-.422-.56-.236-.965-.52-1.353-.908-.388-.388-.672-.793-.908-1.353-.173-.422-.367-1.057-.422-2.227-.059-1.266-.071-1.646-.071-4.85s.012-3.584.071-4.85c.055-1.17.249-1.805.422-2.227.236-.56.52-.965.908-1.353.388-.388.793-.672 1.353-.908.422-.173 1.057-.367 2.227-.422 1.266-.059 1.646-.071 4.85-.071zm0-2.163c-3.264 0-3.664.014-4.949.073-1.32.062-2.215.28-2.91.566-.757.303-1.365.748-1.979 1.362s-1.059 1.222-1.362 1.979c-.286.695-.504 1.59-.566 2.91-.059 1.285-.073 1.685-.073 4.949s.014 3.664.073 4.949c.062 1.32.28 2.215.566 2.91.303.757.748 1.365 1.362 1.979s1.222 1.059 1.979 1.362c.695.286 1.59.504 2.91.566 1.285.059 1.685.073 4.949.073s3.664-.014 4.949-.073c1.32-.062 2.215-.28 2.91-.566.757-.303 1.365-.748 1.979-1.362s1.059-1.222 1.362-1.979c.286-.695.504-1.59.566-2.91.059-1.285.073-1.685.073-4.949s-.014-3.664-.073-4.949c-.062-1.32-.28-2.215-.566-2.91-.303-.757-.748-1.365-1.362-1.979s-1.059-1.222-1.979-1.362c-.695-.286-1.59-.504-2.91-.566-1.285-.059-1.685-.073-4.949-.073zm0 3.654c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm0-2.163c-3.606 0-6.505 2.899-6.505 6.505s2.899 6.505 6.505 6.505 6.505-2.899 6.505-6.505-2.899-6.505-6.505-6.505zm6.574-.908c-.752 0-1.362.61-1.362 1.362s.61 1.362 1.362 1.362 1.362-.61 1.362-1.362-.61-1.362-1.362-1.362z"/></svg>
                            </a>
                        </div>
                        <p className="text-sm text-gray-400">&copy; 2024 Saksham. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
