import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsAndPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="fixed top-4 left-4 z-10">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center bg-gaming-card/80 backdrop-blur-md border border-gaming-border shadow-md hover:bg-gaming-primary/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>
      
      <div className="prose prose-invert prose-gaming max-w-none pt-10">
        <h1 className="text-3xl font-bold text-gaming-primary mb-6">Terms and Policy for Freefire Tournaments PWA</h1>
        
        <p className="text-sm text-gaming-text/70 mb-6">Last Updated: May 1, 2025</p>
        
        <p>Welcome to <strong>Freefire Tournaments</strong>, a Progressive Web App (PWA) designed to host and manage Free Fire tournaments. By accessing or using our platform, you agree to be bound by these Terms and Policy ("Terms"). If you do not agree, please do not use the app. These Terms govern your use of the app, including features such as tournament creation, participation, payments, and user interactions.</p>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">1. General Terms of Use</h2>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">1.1 Eligibility</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must be at least 13 years old to use Freefire Tournaments. If you are under 18, you must have parental or guardian consent.</li>
          <li>You must provide accurate and complete information during registration, including your Free Fire In-Game Name (IGN) and email address.</li>
          <li>Accounts are non-transferable and may not be shared.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">1.2 Account Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for maintaining the confidentiality of your account credentials (email, password, etc.).</li>
          <li>You are liable for all activities conducted through your account.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">1.3 Acceptable Use</h3>
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
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">2. Tournament Policies</h2>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">2.1 Tournament Creation</h3>
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
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">2.2 Joining Tournaments</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Participants must pay the entry fee via Cashfree to join a tournament.</li>
          <li>Entry fees are non-refundable.</li>
          <li>Participants must join the custom room using the provided Room ID and password at the scheduled time. Failure to join may result in forfeiture without refund.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">2.3 Prize Distribution</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Prizes are distributed based on the host's specified distribution (e.g., 70% to 1st, 20% to 2nd, 10% to 3rd) and credited to winners' in-app wallets.</li>
          <li>Winners must provide accurate payment details for withdrawals (if applicable).</li>
          <li>Freefire Tournaments is not responsible for delays caused by third-party payment providers (e.g., Cashfree).</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">2.4 Tournament Cancellations</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>If the platform cancels a tournament due to technical issues or violations, refunds will be issued within 7 business days.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">3. Payment and Wallet Policies</h2>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">3.1 Payment Processing</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>All payments (entry fees, deposits, withdrawals) are processed via Cashfree, a third-party payment provider.</li>
          <li>Users must comply with Cashfree's terms and provide valid payment information.</li>
          <li>Freefire Tournaments is not liable for errors or delays caused by Cashfree.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">3.2 Wallet Management</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Users can add funds to their in-app wallet via Cashfree for entry fees or other transactions.</li>
          <li>Withdrawals require KYC verification (e.g., ID proof, bank details) to comply with applicable laws.</li>
          <li>Minimum and maximum limits for deposits and withdrawals may apply, as displayed in the app.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">3.3 Transaction Fees</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Certain transactions (e.g., withdrawals) may incur fees, which will be clearly displayed before confirmation.</li>
          <li>Users are responsible for any additional bank or payment provider fees.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">4. Privacy Policy</h2>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.1 Data Collection</h3>
        <p>We collect the following data to provide and improve our services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Information</strong>: Email, Free Fire IGN, and optional social login details (e.g., Google, Discord).</li>
          <li><strong>Tournament Data</strong>: Details you provide when creating or joining tournaments (e.g., game mode, custom room settings).</li>
          <li><strong>Payment Data</strong>: Transaction details processed via Cashfree (we do not store payment card information).</li>
          <li><strong>Usage Data</strong>: Analytics on app usage, such as page views and tournament participation, stored in Supabase.</li>
          <li><strong>Media</strong>: Images or media uploaded for tournament banners, profiles, or match highlights.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.2 Data Usage</h3>
        <p>We use your data to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Authenticate and manage your account.</li>
          <li>Facilitate tournament creation, participation, and prize distribution.</li>
          <li>Process payments and maintain wallet balances.</li>
          <li>Improve the app through analytics and monitor for security threats.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.3 Data Sharing</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>We share data with:
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Supabase</strong>: For authentication, database, storage, and real-time features (see Supabase's privacy policy).</li>
              <li><strong>Cashfree</strong>: For payment processing (see Cashfree's privacy policy).</li>
              <li><strong>Hosts/Participants</strong>: Limited data (e.g., IGN) is shared with tournament hosts or participants as needed for gameplay.</li>
            </ul>
          </li>
          <li>We do not sell your personal data to third parties.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.4 Data Security</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>We use HTTPS, Supabase's Row-Level Security (RLS), and Netlify's security features to protect your data.</li>
          <li>You are responsible for securing your account credentials and not sharing sensitive information (e.g., Room IDs) publicly.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.5 Data Retention</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account data is retained as long as your account is active. You may request deletion by contacting <strong>ngmodz05@gmail.com.</strong></li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">4.6 Your Rights</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You may access, update, or delete your personal data via the app's profile settings or by contacting us.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">5. Intellectual Property</h2>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">5.1 App Content</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Freefire Tournaments, including its design, code, and branding, is owned by the platform's creators or licensors.</li>
          <li>You may not copy, modify, or distribute the app's content without permission.</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gaming-text mt-6 mb-3">5.2 User Content</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You retain ownership of content you upload (e.g., tournament banners, profile avatars).</li>
          <li>By uploading, you grant Freefire Tournaments a non-exclusive, worldwide, royalty-free license to use, display, and store your content for app functionality.</li>
          <li>Do not upload content that violates third-party rights (e.g., copyrighted images).</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">6. Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Freefire Tournaments is provided "as is" without warranties of any kind.</li>
          <li>We are not liable for:
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Losses due to Free Fire gameplay issues, user errors, or third-party services (e.g., Supabase, Cashfree).</li>
              <li>Unauthorized access to your account due to your failure to secure credentials.</li>
              <li>Tournament disputes or unfair play unless caused by platform errors.</li>
            </ul>
          </li>
          <li>Our liability is limited to the amount you paid for services in the preceding 12 months.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">7. Termination</h2>
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
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">8. Modifications to Terms</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We may update these Terms at any time. Changes will be posted in the app or emailed to users.</li>
          <li>Continued use after changes constitutes acceptance of the updated Terms.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">9. Governing Law and Dispute Resolution</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>These Terms are governed by the laws of India.</li>
          <li>Disputes will be resolved through arbitration in Delhi, India, in accordance with the Arbitration and Conciliation Act, 1996. Arbitration will be conducted in English.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gaming-accent mt-8 mb-4">10. Contact Us</h2>
        <p>For questions, support, or data requests, contact us at:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Email: <strong>ngmodz05@gmail.com</strong></li>
        </ul>
        
        <p className="mt-6">Thank you for using Freefire Tournaments. Let's create epic Free Fire battles together!</p>
      </div>
      
      {/* Blank spacer to prevent content from touching bottom of screen */}
      <div className="h-24 w-full mt-8"></div>
    </div>
  );
};

export default TermsAndPolicy; 