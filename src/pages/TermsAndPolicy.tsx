import { ArrowLeft, ChevronRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const TermsAndPolicy = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("section-1");
  
  // Table of contents items
  const tocItems = [
    { id: "section-1", title: "General Terms of Use" },
    { id: "section-2", title: "Tournament Policies" },
    { id: "section-3", title: "Payment and Wallet" },
    { id: "section-4", title: "Privacy Policy" },
    { id: "section-5", title: "Intellectual Property" },
    { id: "section-6", title: "Limitation of Liability" },
    { id: "section-7", title: "Termination" },
    { id: "section-8", title: "Modifications to Terms" },
    { id: "section-9", title: "Governing Law" },
    { id: "section-10", title: "Contact Us" }
  ];

  // Handle scrolling to sections
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Adjust based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Track scroll position to update active TOC item
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll("h2[id]");
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
          }
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gaming-bg">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-gaming-bg/95 backdrop-blur-md border-b border-gaming-border shadow-lg px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gaming-text/70 hover:text-gaming-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-gaming-primary mx-auto pr-10">Terms and Policy</h1>
      </div>
      
      <div className="container mx-auto py-6 px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Mobile TOC Dropdown */}
          <div className="lg:hidden mb-6">
            <div className="bg-gaming-card rounded-lg p-4 shadow-md">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-gaming-primary font-bold">Table of Contents</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronRight size={20} />
                  </span>
                </summary>
                <div className="mt-3 group-open:animate-fadeIn">
                  <ul className="space-y-2 pl-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`text-left w-full px-2 py-1 rounded hover:bg-gaming-card/80 transition-colors ${
                            activeSection === item.id ? "text-gaming-primary font-medium" : "text-gaming-text/80"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          </div>
          
          {/* Desktop TOC Sidebar */}
          <div className="hidden lg:block sticky self-start top-24 h-[calc(100vh-6rem)] overflow-y-auto w-64 flex-shrink-0">
            <div className="bg-gaming-card rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-bold text-gaming-primary mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full px-3 py-2 rounded transition-all duration-200 hover:bg-gaming-card/80 ${
                        activeSection === item.id 
                          ? "text-gaming-primary font-medium border-l-2 border-gaming-primary pl-2" 
                          : "text-gaming-text/80"
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div 
            ref={contentRef}
            className="flex-1 prose prose-invert prose-gaming max-w-none lg:max-w-4xl"
          >
            <div className="mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30"
              >
                <h1 className="text-3xl font-bold text-gaming-primary mb-3">Terms and Policy for Freefire Tournaments</h1>
                <p className="text-sm text-gaming-text/70 mb-6">Last Updated: May 1, 2025</p>
                
                <div className="p-4 bg-gaming-card/50 border border-gaming-border/10 rounded-md mb-6">
                  <p className="text-gaming-text/90">
                    Welcome to <strong className="text-gaming-primary">Freefire Tournaments</strong>, a Progressive Web App (PWA) designed to host and manage Free Fire tournaments. By accessing or using our platform, you agree to be bound by these Terms and Policy ("Terms"). If you do not agree, please do not use the app. These Terms govern your use of the app, including features such as tournament creation, participation, payments, and user interactions.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <section id="section-1" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">1. General Terms of Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">1.1 Eligibility</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You must be at least 13 years old to use Freefire Tournaments. If you are under 18, you must have parental or guardian consent.</li>
                      <li>You must provide accurate and complete information during registration, including your Free Fire In-Game Name (IGN) and email address.</li>
                      <li>Accounts are non-transferable and may not be shared.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">1.2 Account Responsibilities</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You are responsible for maintaining the confidentiality of your account credentials (email, password, etc.).</li>
                      <li>You are liable for all activities conducted through your account.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">1.3 Acceptable Use</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Use the app only for lawful purposes and in accordance with these Terms.</li>
                      <li>Do not engage in:
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                          <li>Cheating, hacking, or exploiting bugs in Free Fire or the app.</li>
                          <li>Sharing custom room details (Room ID/password) publicly or with non-participants.</li>
                          <li>Posting offensive, defamatory, or illegal content in chats, descriptions, or profiles.</li>
                          <li>Attempting to disrupt the app's functionality (e.g., DDoS attacks, unauthorized access).</li>
                        </ul>
                      </li>
                      <li>Violation of these rules may result in account suspension or termination.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section id="section-2" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">2. Tournament Policies</h2>
                
                <div className="space-y-6">
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">2.1 Tournament Creation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Hosts must provide accurate tournament details, including game mode, entry fees, prize distribution, and custom room settings.</li>
                      <li>Hosts are responsible for:
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                          <li>Ensuring fair play and adherence to Free Fire's rules (e.g., no emulators unless specified).</li>
                          <li>Entering accurate results promptly after the tournament.</li>
                          <li>Communicating clearly with participants via the app.</li>
                        </ul>
                      </li>
                      <li>Tournaments must comply with Free Fire's terms and local laws.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">2.2 Joining Tournaments</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Participants must pay the entry fee via Cashfree to join a tournament.</li>
                      <li>Entry fees are non-refundable.</li>
                      <li>Participants must join the custom room using the provided Room ID and password at the scheduled time. Failure to join may result in forfeiture without refund.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">2.3 Prize Distribution</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Prizes are distributed based on the host's specified distribution (e.g., 70% to 1st, 20% to 2nd, 10% to 3rd) and credited to winners' in-app wallets.</li>
                      <li>Winners must provide accurate payment details for withdrawals (if applicable).</li>
                      <li>Freefire Tournaments is not responsible for delays caused by third-party payment providers (e.g., Cashfree).</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">2.4 Tournament Cancellations</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>If the platform cancels a tournament due to technical issues or violations, refunds will be issued within 7 business days.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section id="section-3" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">3. Payment and Wallet Policies</h2>
                
                <div className="space-y-6">
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">3.1 Payment Processing</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All payments (entry fees, deposits, withdrawals) are processed via Cashfree, a third-party payment provider.</li>
                      <li>Users must comply with Cashfree's terms and provide valid payment information.</li>
                      <li>Freefire Tournaments is not liable for errors or delays caused by Cashfree.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">3.2 Wallet Management</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Users can add funds to their in-app wallet via Cashfree for entry fees or other transactions.</li>
                      <li>Withdrawals require KYC verification (e.g., ID proof, bank details) to comply with applicable laws.</li>
                      <li>Minimum and maximum limits for deposits and withdrawals may apply, as displayed in the app.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">3.3 Transaction Fees</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Certain transactions (e.g., withdrawals) may incur fees, which will be clearly displayed before confirmation.</li>
                      <li>Users are responsible for any additional bank or payment provider fees.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section id="section-4" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">4. Privacy Policy</h2>
                
                <div className="space-y-6">
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.1 Data Collection</h3>
                    <p>We collect the following data to provide and improve our services:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Personal Information</strong>: Email, Free Fire IGN, and optional social login details (e.g., Google, Discord).</li>
                      <li><strong>Tournament Data</strong>: Details you provide when creating or joining tournaments (e.g., game mode, custom room settings).</li>
                      <li><strong>Payment Data</strong>: Transaction details processed via Cashfree (we do not store payment card information).</li>
                      <li><strong>Usage Data</strong>: Analytics on app usage, such as page views and tournament participation, stored in Firebase.</li>
                      <li><strong>Media</strong>: Images or media uploaded for tournament banners, profiles, or match highlights.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.2 Data Usage</h3>
                    <p>We use your data to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Authenticate and manage your account.</li>
                      <li>Facilitate tournament creation, participation, and prize distribution.</li>
                      <li>Process payments and maintain wallet balances.</li>
                      <li>Improve the app through analytics and monitor for security threats.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.3 Data Sharing</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>We share data with:
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                          <li><strong>Firebase</strong>: For authentication, database, storage, and real-time features (see Firebase's privacy policy).</li>
                          <li><strong>Cashfree</strong>: For payment processing (see Cashfree's privacy policy).</li>
                          <li><strong>Hosts/Participants</strong>: Limited data (e.g., IGN) is shared with tournament hosts or participants as needed for gameplay.</li>
                        </ul>
                      </li>
                      <li>We do not sell your personal data to third parties.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.4 Data Security</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>We use HTTPS, Firebase's security features, and Netlify's security features to protect your data.</li>
                      <li>You are responsible for securing your account credentials and not sharing sensitive information (e.g., Room IDs) publicly.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.5 Data Retention</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Account data is retained as long as your account is active. You may request deletion by contacting <a href="mailto:ngmodz05@gmail.com" className="text-gaming-primary hover:text-gaming-accent underline transition-colors duration-200 inline-flex items-center"><strong>ngmodz05@gmail.com</strong></a>.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">4.6 Your Rights</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You may access, update, or delete your personal data via the app's profile settings or by contacting us.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section id="section-5" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">5. Intellectual Property</h2>
                
                <div className="space-y-6">
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">5.1 App Content</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Freefire Tournaments, including its design, code, and branding, is owned by the platform's creators or licensors.</li>
                      <li>You may not copy, modify, or distribute the app's content without permission.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                    <h3 className="text-xl font-semibold text-gaming-text mb-3">5.2 User Content</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You retain ownership of content you upload (e.g., tournament banners, profile avatars).</li>
                      <li>By uploading, you grant Freefire Tournaments a non-exclusive, worldwide, royalty-free license to use, display, and store your content for app functionality.</li>
                      <li>Do not upload content that violates third-party rights (e.g., copyrighted images).</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section id="section-6" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">6. Limitation of Liability</h2>
                
                <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Freefire Tournaments is provided "as is" without warranties of any kind.</li>
                    <li>We are not liable for:
                      <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Losses due to Free Fire gameplay issues, user errors, or third-party services (e.g., Firebase, Cashfree).</li>
                        <li>Unauthorized access to your account due to your failure to secure credentials.</li>
                        <li>Tournament disputes or unfair play unless caused by platform errors.</li>
                      </ul>
                    </li>
                    <li>Our liability is limited to the amount you paid for services in the preceding 12 months.</li>
                  </ul>
                </div>
              </section>
              
              <section id="section-7" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">7. Termination</h2>
                
                <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We may suspend or terminate your account for:
                      <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Violation of these Terms (e.g., cheating, abusive behavior).</li>
                        <li>Legal or regulatory requirements.</li>
                        <li>Inactivity for 12 months.</li>
                      </ul>
                    </li>
                    <li>Upon termination, your access to tournaments and wallet funds may be restricted. Contact <strong>ngmodz05@gmail.com</strong> to resolve outstanding issues.</li>
                  </ul>
                </div>
              </section>
              
              <section id="section-8" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">8. Modifications to Terms</h2>
                
                <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We may update these Terms at any time. Changes will be posted in the app or emailed to users.</li>
                    <li>Continued use after changes constitutes acceptance of the updated Terms.</li>
                  </ul>
                </div>
              </section>
              
              <section id="section-9" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">9. Governing Law and Dispute Resolution</h2>
                
                <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>These Terms are governed by the laws of India.</li>
                    <li>Disputes will be resolved through arbitration in Delhi, India, in accordance with the Arbitration and Conciliation Act, 1996. Arbitration will be conducted in English.</li>
                  </ul>
                </div>
              </section>
              
              <section id="section-10" className="bg-gaming-card p-6 rounded-lg shadow-md border border-gaming-border/30 mb-8">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4">10. Contact Us</h2>
                
                <div className="bg-gaming-card/50 p-4 rounded-lg border border-gaming-border/10">
                  <p className="mb-3">For questions, support, or data requests, contact us at:</p>
                  <div className="p-3 bg-gaming-primary/10 rounded-md inline-block hover:bg-gaming-primary/20 transition-colors duration-200">
                    <a 
                      href="mailto:ngmodz05@gmail.com" 
                      className="flex items-center gap-2 text-gaming-primary font-medium hover:text-gaming-accent transition-colors duration-200"
                    >
                      <Mail size={18} />
                      <span><strong>ngmodz05@gmail.com</strong></span>
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gaming-accent/10 rounded-md border border-gaming-accent/20">
                  <p className="text-center text-gaming-text/90">
                    Thank you for using Freefire Tournaments. Let's create epic Free Fire battles together!
                  </p>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicy; 