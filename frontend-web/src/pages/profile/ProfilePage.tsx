import React from 'react';

export default function ProfilePage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-headline-lg text-primary tracking-tight">Account & Settings</h1>
        <p className="text-body-md text-on-surface-variant">Manage your profile and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-1">
          {['Profile', 'Organization', 'Billing', 'Notifications', 'Security'].map(tab => (
            <button key={tab} className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'Profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-4">Personal Information</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center text-[28px] font-semibold">
                AK
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg border border-outline-variant/30 text-primary text-[13px] font-medium hover:bg-surface-container-low transition-colors">Change Photo</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">Full Name</label>
                <input type="text" defaultValue="Arjun Kapoor" className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 text-[14px] focus:border-secondary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">Email Address</label>
                <input type="email" defaultValue="arjun.k@techcorp.in" className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 text-[14px] focus:border-secondary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">Role</label>
                <input type="text" defaultValue="Compliance Officer" className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 text-[14px] focus:border-secondary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">Phone Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-3 py-2 rounded-xl border border-outline-variant/30 text-[14px] focus:border-secondary outline-none transition-colors" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
