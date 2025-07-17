import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BrainCircuit, ShieldCheck } from 'lucide-react';

const LandingPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
        <motion.div variants={itemVariants} className="bg-premium-dark-gray/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
            <div className="w-12 h-12 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20 mx-auto mb-4">
                <Icon className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-premium-platinum mb-2">{title}</h3>
            <p className="text-premium-light-gray/70 text-sm">{description}</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-premium-dark font-inter text-premium-platinum overflow-x-hidden">
            <div className="absolute inset-0 bg-premium-decorative-gradient opacity-10"></div>
            
            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
                        <span className="text-black font-bold text-sm">P</span>
                    </div>
                    <h1 className="text-xl font-bold">P.AI</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-premium-light-gray hover:text-premium-gold transition-colors">
                        Login
                    </Link>
                    <Link to="/login">
                        <motion.button 
                            className="px-4 py-2 bg-premium-gold text-black rounded-xl text-sm font-semibold shadow-lg shadow-premium-gold/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <motion.section 
                    className="text-center py-20 px-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        variants={itemVariants} 
                        className="text-5xl md:text-7xl font-extrabold bg-gold-diamond-gradient bg-clip-text text-transparent mb-6"
                    >
                        Your Intelligent Assistant, Reimagined.
                    </motion.h1>
                    <motion.p 
                        variants={itemVariants} 
                        className="max-w-3xl mx-auto text-lg md:text-xl text-premium-light-gray/80 mb-8"
                    >
                        P.AI is a next-generation AI assistant designed to understand your context, remember your preferences, and supercharge your productivity.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <Link to="/login">
                            <motion.button 
                                className="px-8 py-4 bg-premium-gold text-black rounded-xl font-semibold flex items-center mx-auto shadow-lg shadow-premium-gold/40"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Features Section */}
                <motion.section 
                    className="py-20 px-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="max-w-5xl mx-auto">
                        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12">Why P.AI?</motion.h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={Zap} 
                                title="Hyper-Personalized" 
                                description="P.AI learns from your interactions to provide truly tailored assistance and suggestions." 
                            />
                            <FeatureCard 
                                icon={BrainCircuit} 
                                title="Context-Aware Memory" 
                                description="Never repeat yourself. P.AI remembers past conversations and documents to maintain context." 
                            />
                            <FeatureCard 
                                icon={ShieldCheck} 
                                title="Private & Secure" 
                                description="Your data is yours. We prioritize privacy with end-to-end encryption and robust security." 
                            />
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default LandingPage;
