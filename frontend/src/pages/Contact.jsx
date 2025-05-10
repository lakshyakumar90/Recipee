import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '@/config/firebase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get Firebase Functions instance
      const functions = getFunctions();

      // Get the sendContactEmail function
      const sendContactEmail = httpsCallable(functions, 'sendContactEmail');

      // Call the function with form data
      const result = await sendContactEmail(formData);

      if (result.data && result.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="bg-card border rounded-lg p-6 mb-8">
        <p className="text-muted-foreground mb-6">
          Have a question, suggestion, or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.
        </p>

        {submitStatus === 'success' && (
          <div className="bg-green-500/10 text-green-500 p-4 rounded-md mb-6 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm mt-1">Thank you for reaching out. We'll get back to you as soon as possible.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Failed to send message</p>
              <p className="text-sm mt-1">There was an error sending your message. Please try again later.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.name ? 'border-destructive' : 'border-input'
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.email ? 'border-destructive' : 'border-input'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                errors.subject ? 'border-destructive' : 'border-input'
              }`}
              placeholder="What is this regarding?"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                errors.message ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Your message here..."
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </span>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">support@recipebook.com</p>
          </div>
          <div>
            <p className="font-medium">Social Media</p>
            <p className="text-muted-foreground">Follow us on social media for updates and more recipes!</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
