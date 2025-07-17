import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    Zap, 
    BrainCircuit, 
    ShieldCheck, 
    CheckSquare, 
    FolderOpen, 
    Calendar,
    Code,
    BookOpen,
    Briefcase,
    Check,
    Twitter,
    Github,
    Linkedin,
    Sparkles
} from 'lucide-react';

// Main Landing Page Component
const LandingPage: React.FC = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen bg-premium-dark font-inter text-premium-platinum overflow-x-hidden">
            <div className="absolute inset-0 bg-premium-decorative-gradient opacity-10 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_40%)] z-0"></div>
            
            <Header />

            <main className="relative z-10">
                <HeroSection variants={{ container: containerVariants, item: itemVariants }} />
                <FeaturesSection variants={{ container: containerVariants, item: itemVariants }} />
                <UseCasesSection variants={{ container: containerVariants, item: itemVariants }} />
                <TestimonialsSection variants={{ container: containerVariants, item: itemVariants }} />
                <PricingSection variants={{ container: containerVariants, item: itemVariants }} />
                <FinalCTASection variants={{ container: containerVariants, item: itemVariants }} />
            </main>

            <Footer />
        </div>
    );
};

// Header Component
const Header: React.FC = () => (
    <header className="relative z-20 p-6 flex justify-between items-center backdrop-blur-sm bg-premium-dark/50 sticky top-0">
        <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
                <span className="text-black font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold">P.AI</h1>
        </Link>
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
);

// Hero Section Component
const HeroSection: React.FC<{ variants: any }> = ({ variants }) => (
    <motion.section 
        className="text-center pt-20 pb-28 px-6"
        variants={variants.container}
        initial="hidden"
        animate="visible"
    >
        <motion.h1 
            variants={variants.item} 
            className="text-5xl md:text-7xl font-extrabold bg-gold-diamond-gradient bg-clip-text text-transparent mb-6 leading-tight"
        >
            Your Intelligent Assistant, Reimagined.
        </motion.h1>
        <motion.p 
            variants={variants.item} 
            className="max-w-3xl mx-auto text-lg md:text-xl text-premium-light-gray/80 mb-10"
        >
            P.AI is a next-generation AI assistant designed to understand your context, remember your preferences, and supercharge your productivity across all your digital tasks.
        </motion.p>
        <motion.div variants={variants.item}>
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
);

// Features Section Component
const FeaturesSection: React.FC<{ variants: any }> = ({ variants }) => {
    const features = [
        { icon: Zap, title: "Hyper-Personalized", description: "P.AI learns from your interactions to provide truly tailored assistance and suggestions." },
        { icon: BrainCircuit, title: "Context-Aware Memory", description: "Never repeat yourself. P.AI remembers past conversations and documents to maintain context." },
        { icon: ShieldCheck, title: "Private & Secure", description: "Your data is yours. We prioritize privacy with end-to-end encryption and robust security." },
        { icon: CheckSquare, title: "Integrated Task Management", description: "Organize your life and projects with AI-powered task lists and reminders." },
        { icon: FolderOpen, title: "Seamless File Integration", description: "Connect your cloud storage and local files for a unified information hub." },
        { icon: Calendar, title: "Intelligent Calendar", description: "Let P.AI manage your schedule, find meeting times, and set reminders intelligently." },
    ];

    return (
        <motion.section 
            className="py-20 px-6 bg-premium-dark-gray/40"
            variants={variants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-6xl mx-auto">
                <motion.h2 variants={variants.item} className="text-4xl font-bold text-center mb-4">Everything You Need, All in One Place</motion.h2>
                <motion.p variants={variants.item} className="text-lg text-premium-light-gray/70 text-center mb-12 max-w-3xl mx-auto">P.AI is more than a chatbot. It's a comprehensive suite of tools designed to be your second brain.</motion.p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={variants.item} className="bg-premium-dark-gray/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20 flex-shrink-0">
                                    <feature.icon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-premium-platinum">{feature.title}</h3>
                                </div>
                            </div>
                            <p className="text-premium-light-gray/70 text-sm mt-4">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

// Use Cases Section Component
const UseCasesSection: React.FC<{ variants: any }> = ({ variants }) => (
    <motion.section 
        className="py-20 px-6"
        variants={variants.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="max-w-6xl mx-auto">
            <motion.h2 variants={variants.item} className="text-4xl font-bold text-center mb-12">Built for Every Aspect of Your Life</motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={variants.item} className="bg-premium-dark-gray/60 p-8 rounded-2xl border border-white/10">
                    <Code className="w-8 h-8 text-premium-gold mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">For Developers</h3>
                    <p className="text-premium-light-gray/70 mb-4">Generate code, debug errors, and understand complex algorithms in seconds.</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Code Generation & Refactoring</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Error Analysis & Debugging</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> API Documentation</li>
                    </ul>
                </motion.div>
                <motion.div variants={variants.item} className="bg-premium-dark-gray/60 p-8 rounded-2xl border border-white/10">
                    <BookOpen className="w-8 h-8 text-premium-gold mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">For Students</h3>
                    <p className="text-premium-light-gray/70 mb-4">Ace your studies with research assistance, summarization, and study planning.</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Research & Summarization</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Language Learning & Practice</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Create Study Plans</li>
                    </ul>
                </motion.div>
                <motion.div variants={variants.item} className="bg-premium-dark-gray/60 p-8 rounded-2xl border border-white/10">
                    <Briefcase className="w-8 h-8 text-premium-gold mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">For Professionals</h3>
                    <p className="text-premium-light-gray/70 mb-4">Draft emails, create presentations, and analyze data to stay ahead.</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Email & Report Drafting</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Market Analysis</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-premium-gold"/> Meeting Summaries</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    </motion.section>
);

// Testimonials Section Component
const TestimonialsSection: React.FC<{ variants: any }> = ({ variants }) => {
    const testimonials = [
        { name: 'Sarah L.', role: 'Software Engineer', quote: '"P.AI has completely changed my workflow. The context memory is a game-changer for complex coding sessions."', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { name: 'David C.', role: 'Marketing Manager', quote: '"From drafting campaign copy to analyzing market data, P.AI is my go-to creative partner. It\'s like having a brilliant strategist on my team 24/7."', avatar: 'https://i.pravatar.cc/150?u=david' },
        { name: 'Maria G.', role: 'PhD Student', quote: '"The ability to summarize dense research papers and organize my notes has saved me countless hours. I can\'t imagine my academic life without it."', avatar: 'https://i.pravatar.cc/150?u=maria' },
    ];
    return (
        <motion.section 
            className="py-20 px-6 bg-premium-dark-gray/40"
            variants={variants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-6xl mx-auto">
                <motion.h2 variants={variants.item} className="text-4xl font-bold text-center mb-12">Loved by innovators everywhere</motion.h2>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div key={i} variants={variants.item} className="bg-premium-dark-gray/60 p-8 rounded-2xl border border-white/10 flex flex-col">
                            <Sparkles className="w-6 h-6 text-premium-gold mb-4"/>
                            <p className="text-premium-light-gray/90 mb-6 flex-1">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-premium-gold/50"/>
                                <div>
                                    <p className="font-semibold text-premium-platinum">{testimonial.name}</p>
                                    <p className="text-sm text-premium-light-gray/60">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

// Pricing Section Component
const PricingSection: React.FC<{ variants: any }> = ({ variants }) => (
    <motion.section 
        className="py-20 px-6"
        variants={variants.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="max-w-6xl mx-auto">
            <motion.h2 variants={variants.item} className="text-4xl font-bold text-center mb-4">Simple, transparent pricing</motion.h2>
            <motion.p variants={variants.item} className="text-lg text-premium-light-gray/70 text-center mb-12">Choose the plan that's right for you.</motion.p>
            <div className="grid lg:grid-cols-3 gap-8 items-center">
                <PricingCard variants={variants.item} title="Free" price="$0" features={['Basic AI Chat', 'Standard Memory', '10 Tasks', '100MB File Storage']} />
                <PricingCard variants={variants.item} title="Pro" price="$20" popular={true} features={['Advanced AI Model', 'Extended Memory', 'Unlimited Tasks', '10GB File Storage', 'Priority Support']} />
                <PricingCard variants={variants.item} title="Enterprise" price="Contact Us" features={['Dedicated Models', 'Unlimited Memory', 'Team Collaboration', 'Advanced Security', 'Dedicated Support']} />
            </div>
        </div>
    </motion.section>
);

const PricingCard: React.FC<{ variants: any, title: string, price: string, features: string[], popular?: boolean }> = ({ variants, title, price, features, popular }) => (
    <motion.div variants={variants} className={`relative bg-premium-dark-gray/60 p-8 rounded-2xl border ${popular ? 'border-premium-gold shadow-gold-glow' : 'border-white/10'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-premium-gold text-black text-sm font-semibold rounded-full">Most Popular</div>}
        <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>
        <p className="text-center text-premium-light-gray/70 mb-6">{title === "Enterprise" ? "Custom Pricing" : "per month"}</p>
        <p className="text-5xl font-bold text-center mb-8">{price}</p>
        <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm"><Check className="w-4 h-4 mr-3 text-premium-gold"/>{feature}</li>
            ))}
        </ul>
        <Link to="/login">
            <motion.button className={`w-full py-3 rounded-xl font-semibold ${popular ? 'bg-premium-gold text-black' : 'bg-premium-medium-gray text-premium-platinum'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started
            </motion.button>
        </Link>
    </motion.div>
);

// Final CTA Section Component
const FinalCTASection: React.FC<{ variants: any }> = ({ variants }) => (
    <motion.section 
        className="py-20 px-6"
        variants={variants.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="max-w-4xl mx-auto text-center">
            <motion.h2 variants={variants.item} className="text-4xl md:text-5xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent mb-6">Ready to Unlock Your Potential?</motion.h2>
            <motion.p variants={variants.item} className="text-lg text-premium-light-gray/80 mb-8">Join thousands of users who are redefining productivity with P.AI.</motion.p>
            <motion.div variants={variants.item}>
                <Link to="/login">
                    <motion.button 
                        className="px-8 py-4 bg-premium-gold text-black rounded-xl font-semibold flex items-center mx-auto shadow-lg shadow-premium-gold/40"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up Now <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    </motion.section>
);

// Footer Component
const Footer: React.FC = () => (
    <footer className="bg-premium-dark-gray/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
                            <span className="text-black font-bold text-sm">P</span>
                        </div>
                        <h1 className="text-xl font-bold">P.AI</h1>
                    </div>
                    <p className="text-sm text-premium-light-gray/60">The future of intelligent assistance.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-premium-light-gray/70">
                        <li><a href="#" className="hover:text-premium-gold">Features</a></li>
                        <li><a href="#" className="hover:text-premium-gold">Pricing</a></li>
                        <li><a href="#" className="hover:text-premium-gold">Security</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-premium-light-gray/70">
                        <li><a href="#" className="hover:text-premium-gold">About Us</a></li>
                        <li><a href="#" className="hover:text-premium-gold">Careers</a></li>
                        <li><a href="#" className="hover:text-premium-gold">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-premium-light-gray/70">
                        <li><a href="#" className="hover:text-premium-gold">Blog</a></li>
                        <li><a href="#" className="hover:text-premium-gold">Help Center</a></li>
                        <li><a href="#" className="hover:text-premium-gold">API Docs</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex justify-between items-center text-sm text-premium-light-gray/60">
                <p>&copy; {new Date().getFullYear()} P.AI Corporation. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-premium-gold"><Twitter className="w-5 h-5"/></a>
                    <a href="#" className="hover:text-premium-gold"><Github className="w-5 h-5"/></a>
                    <a href="#" className="hover:text-premium-gold"><Linkedin className="w-5 h-5"/></a>
                </div>
            </div>
        </div>
    </footer>
);

export default LandingPage;
