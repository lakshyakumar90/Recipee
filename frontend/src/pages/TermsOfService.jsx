import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Introduction</h2>
          <p>
            Welcome to RecipeBook. These terms and conditions outline the rules and regulations for the use of our website.
          </p>
          <p className="mt-4">
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use RecipeBook if you do not accept all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">License</h2>
          <p>
            Unless otherwise stated, RecipeBook and/or its licensors own the intellectual property rights for all material on RecipeBook. All intellectual property rights are reserved.
          </p>
          <p className="mt-4">
            You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.
          </p>
          <p className="mt-4">You must not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Republish material from this website</li>
            <li>Sell, rent, or sub-license material from the website</li>
            <li>Reproduce, duplicate, or copy material from the website</li>
            <li>Redistribute content from RecipeBook (unless content is specifically made for redistribution)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Content</h2>
          <p>
            In these terms and conditions, "User Content" means material (including without limitation text, images, audio material, video material, and audio-visual material) that you submit to this website, for whatever purpose.
          </p>
          <p className="mt-4">
            You grant to RecipeBook a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your User Content in any existing or future media. You also grant to RecipeBook the right to sub-license these rights, and the right to bring an action for infringement of these rights.
          </p>
          <p className="mt-4">
            Your User Content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or RecipeBook or a third party.
          </p>
          <p className="mt-4">
            RecipeBook reserves the right to edit or remove any material submitted to this website, or stored on our servers, or hosted or published upon this website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">No Warranties</h2>
          <p>
            This website is provided "as is" without any representations or warranties, express or implied. RecipeBook makes no representations or warranties in relation to this website or the information and materials provided on this website.
          </p>
          <p className="mt-4">
            Nothing on this website constitutes, or is meant to constitute, advice of any kind.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Limitations of Liability</h2>
          <p>
            RecipeBook will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special, or consequential loss; or for any business losses, loss of revenue, income, profits, or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our <Link to="/contact" className="text-primary hover:underline">Contact Us</Link> page.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
