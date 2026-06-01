import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search, HelpCircle, Heart, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function FaqPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFaqIndex, setActiveFaqIndex] = React.useState<number | null>(null);

  const categories = [
    { name: 'All', icon: HelpCircle },
    { name: 'Verification & Vetting', icon: ShieldCheck },
    { name: 'Booking & Scheduling', icon: Clock },
    { name: 'Pricing & Payments', icon: Heart }
  ];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const faqs = [
    {
      category: 'Verification & Vetting',
      q: 'How are caregivers verified?',
      a: 'Every caregiver undergoes a comprehensive verification process, including national background checks, credential and license verification, and professional reference screening.'
    },
    {
      category: 'Booking & Scheduling',
      q: 'Can I change caregivers?',
      a: 'Yes, family peace of mind is our priority. If you feel the caregiver is not the right fit for your loved one, our coordinators will help match you with an alternative caregiver.'
    },
    {
      category: 'Pricing & Payments',
      q: 'Is pricing hourly, weekly, or monthly?',
      a: 'We offer flexible pricing options to fit different needs. You can choose from weekly shifts or monthly care hub packages, or speak to our team for custom schedules.'
    },
    {
      category: 'Booking & Scheduling',
      q: 'What services are available?',
      a: 'Included services vary by plan, ranging from daily living support and companionship to licensed nursing care, vitals monitoring, medication reminders, and coordination.'
    },
    {
      category: 'Booking & Scheduling',
      q: 'Which cities are supported?',
      a: 'Service availability depends on caregiver coverage in your region. You can submit a booking request or check with our care team to verify local coverage.'
    },
    {
      category: 'Booking & Scheduling',
      q: 'How does the booking process work?',
      a: 'Getting care is simple. First, create an elder care profile detailing requirements. Second, select the service and browse caregivers. Third, choose a schedule and submit a booking request for approval.'
    },
    {
      category: 'Verification & Vetting',
      q: 'Are caregivers trained in elderly care?',
      a: 'Yes. Caregivers in our network are selected for their experience, credentials, and compassionate approach to senior and elderly home healthcare support.'
    },
    {
      category: 'Pricing & Payments',
      q: 'Are there any hidden fees or extra charges?',
      a: 'No. Care24 operates on complete transparency. Pricing is clear and upfront, with zero surprises or hidden coordination fees.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">
      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>

      {/* Header Section */}
      <section className="!mt-0 scroll-mt-12 flex flex-col items-center w-full pt-8 pb-16 px-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-sm">
             Support Center
          </Badge>
          <h1 className="text-7xl lg:text-[110px] font-bold text-slate-950 tracking-[-0.06em] mb-12 leading-[0.8]">
            Frequently Asked <br />
            <span className="text-slate-400 font-medium italic">questions.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto mb-16">
            Find answers to common questions about booking, caregiver verification, pricing, and services.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for answers..."
              className="h-16 pl-14 pr-6 bg-slate-50 border border-slate-200 rounded-[24px] text-base font-medium placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-primary/5 shadow-inner"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat.name
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 scale-105'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[48px] p-8 sm:p-16 shadow-xl">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold">
              No matching questions found. Try searching for "caregiver" or "pricing".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div key={index} className="border-b border-slate-100 pb-4">
                  <button 
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="flex justify-between items-center w-full py-5 text-left font-black text-slate-950 text-xl tracking-tight hover:text-primary transition-colors group"
                  >
                     <span>{faq.q}</span>
                     <span className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} />
                     </span>
                  </button>
                  <AnimatePresence initial={false}>
                     {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                           <p className="text-slate-500 font-medium text-md leading-relaxed pr-8 pb-4">
                              {faq.a}
                            </p>
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
