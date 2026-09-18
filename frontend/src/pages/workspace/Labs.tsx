import React from 'react';
import { motion } from 'framer-motion';

const labData = {
  indian_standard: "IS 269:2015",
  labs: [
    { s_no: 1, name: "BIS, Bengaluru Branch Laboratory (BNBL)", address: "Peenya Industrial Area, 1st Stage, Tumkur Road", city: "Bengaluru", state: "Karnataka", contact: "+91 11 23230131", email: "bnbol@bis.gov.in" },
    { s_no: 2, name: "BIS, Central Laboratory (CL)", address: "20/9, Site 4, Sahibabad Industrial Area, Sahibabad", city: "Ghaziabad", state: "Uttar Pradesh", contact: "0120 4177 115", email: "sample@bis.gov.in" },
    { s_no: 3, name: "BIS, Eastern Regional Laboratory (ERL)", address: "1/14, CIT Scheme VII M, VIP Road, Kankurgachi", city: "Kolkata", state: "West Bengal", contact: "+91 33 23209474", email: "sample.erol@bis.gov.in" },
    { s_no: 4, name: "BIS, Guwahati Branch Laboratory (GBL)", address: "2nd Floor, West End Block, Housefed Building Complex", city: "Guwahati", state: "Assam", contact: "+91 9641193329", email: "gbol@bis.gov.in" },
    { s_no: 5, name: "BIS, Northern Regional Laboratory (NRL)", address: "B-69, Industrial Focal Point, Phase VII", city: "Mohali", state: "Punjab", contact: "+91 172 4802676", email: "nrol@bis.gov.in" },
    { s_no: 6, name: "BIS, Patna Branch Laboratory (PBL)", address: "Bureau of Indian Standards, Patliputra Industrial Estate", city: "Patna", state: "Bihar", contact: "0612 2262808", email: "pbol@bis.gov.in" },
    { s_no: 7, name: "BIS, Southern Regional Laboratory (SRL)", address: "IV Cross Road, CIT Campus, Taramani", city: "Chennai", state: "Tamil Nadu", contact: "-", email: "srol@bis.gov.in" },
    { s_no: 8, name: "BIS, Western Regional Laboratory (WRL)", address: "Plot No. E9, Road No. 8, M.I.D.C, Andheri (East)", city: "Mumbai", state: "Maharashtra", contact: "-", email: "wrol@bis.gov.in" },
    { s_no: 9, name: "SIIR, Delhi – Shriram Institute For Industrial Research", address: "19-University Road", city: "Delhi", state: "Delhi", contact: "+91 011 35200445", email: "laxmirawat@shriraminstitute.org" },
    { s_no: 10, name: "Kailtech Test and Research Centre Pvt. Ltd., Indore", address: "141C, Electronic Complex Industrial Area", city: "Indore", state: "Madhya Pradesh", contact: "-", email: "contact@kailtech.net" },
    { s_no: 11, name: "Ghaziabad Testing Laboratories Pvt Ltd", address: "AO 150 Amrit Steel Compound South Side GT Road", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 9891067223", email: "gtaslab@yahoo.com" },
    { s_no: 12, name: "IDMA Laboratories Limited, Panchkula", address: "Plot No. 391 Industrial Area Phase 1", city: "Panchkula", state: "Haryana", contact: "+91 9888002607", email: "testing@idmagroup.co.in" },
    { s_no: 13, name: "National Test House (WR) - NTH", address: "Plot No. F-10, MIDC, Andheri (E)", city: "Mumbai", state: "Maharashtra", contact: "+91 022 28352341", email: "director.nthwr@gov.in" },
    { s_no: 14, name: "National Council for Cement and Building Materials (NCCBM)", address: "NCB Bhavan, Old Bombay Road", city: "Hyderabad", state: "Telangana", contact: "+91 0129 4192222", email: "ncbhcrt@rediffmail.com" },
    { s_no: 15, name: "National Test House (NR) - NTH", address: "Kamla Nehru Nagar", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 9999472699", email: "directorgzb@nth.gov.in" },
    { s_no: 16, name: "Suntech", address: "40-P, Tupudana Industrial Area", city: "Ranchi", state: "Jharkhand", contact: "+91 9934148451", email: "sun.tech.lab@gmail.com" },
    { s_no: 17, name: "Mananda Test House", address: "Dhanauni Road, Derabassi", city: "Derabassi", state: "Punjab", contact: "9988336323", email: "mth17@rediffmail.com" },
    { s_no: 18, name: "Delhi Test House, Azadpur", address: "A-62/3, G T Karnal Road Industrial Area", city: "Delhi", state: "Delhi", contact: "+91 9810442016", email: "info@delhitesthouse.com" },
    { s_no: 19, name: "National Test House (NWR) - NTH", address: "E 763, Road No. 9F1, VKI Area", city: "Jaipur", state: "Rajasthan", contact: "+91 33 23673872", email: "directorjai@nth.gov.in" },
    { s_no: 20, name: "Ace Test House Private Limited", address: "Khasra No. 1048 Near Pepsi Godown, Vill- Bhalaswa", city: "New Delhi", state: "Delhi", contact: "+91 7042858881", email: "acetesthouse@gmail.com" },
    { s_no: 21, name: "Aadco Testing & Research Laboratory Pvt Ltd", address: "F 28 Bulandshahar Road Industrial Area", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 9555443495", email: "aadcolab@gmail.com" },
    { s_no: 22, name: "CEG Test House & Research Centre Private Limited", address: "CEG Tower, B-11(G), Malviya Industrial Area", city: "Jaipur", state: "Rajasthan", contact: "+91 0141 4046599", email: "quality@cegtesthouse.com" },
    { s_no: 23, name: "Choksi Laboratories Limited", address: "Survey No. 9/1, Balaji Tusiyana Industrial Estate", city: "Indore", state: "Madhya Pradesh", contact: "+91 8770896041", email: "qa.indore@choksilab.com" },
    { s_no: 24, name: "National Test House (SR)", address: "Govt. of India, CSIR Road, Taramani", city: "Chennai", state: "Tamil Nadu", contact: "+91 44 22433158", email: "directorchn@nth.gov.in" },
    { s_no: 25, name: "National Council for Cement and Building Materials", address: "34 km, Stone Delhi Mathura Road", city: "Faridabad", state: "Haryana", contact: "0129 266789", email: "ncbcrt2@gmail.com" },
    { s_no: 26, name: "Shriram Institute For Industrial Research", address: "14-15, Sadarmangala Industrial Area, Whitefield Road", city: "Bengaluru", state: "Karnataka", contact: "+91 011 27667267", email: "dn@shriraminstitute-blr.org" },
    { s_no: 27, name: "Lucid Laboratories Private Limited", address: "Plot No. 3, IDA, Balanagar", city: "Hyderabad", state: "Telangana", contact: "+91 040 69042222", email: "info@lucidlabsindia.com" },
    { s_no: 28, name: "Spectro Analytical Labs Private Limited", address: "S-1, GNEPIP Surajpur Industrial Area", city: "Gautam Buddha Nagar", state: "Uttar Pradesh", contact: "+91 9873571512", email: "qa.gn@xoin.eurofinsasia.com" },
    { s_no: 29, name: "National Test House-ER (NTH)", address: "Block-CP, Sector-V, Salt Lake City", city: "Kolkata", state: "West Bengal", contact: "+91 33 23673871", email: "directorkol@nth.gov.in" },
    { s_no: 30, name: "Arihant Analytical Laboratory Pvt. Ltd.", address: "Plot No. 272, Sector-57, Phase IV, HSIIDC Kundli", city: "Sonipat", state: "Haryana", contact: "+91 9310022355", email: "aalkundli@gmail.com" },
    { s_no: 31, name: "Allumera Engineering Solutions Pvt Ltd", address: "Khasra No. 61, Matiala Village, Uttam Nagar", city: "New Delhi", state: "Delhi", contact: "+91 9810040186", email: "aespllab@gmail.com" },
    { s_no: 32, name: "Krishna Digital Material Testing Laboratory LLP", address: "02, Bhawani Nagar, JK Road", city: "Bhopal", state: "Madhya Pradesh", contact: "+91 0755 4001289", email: "krishnalab12@gmail.com" },
    { s_no: 33, name: "National Test House (NER) - NTH", address: "C.I.T.I Complex, Kalapahar", city: "Guwahati", state: "Assam", contact: "+91 0361 2417938", email: "directorguw@nth.gov.in" },
    { s_no: 34, name: "QA Testing Laboratories Private Limited", address: "B-76, Sector-64", city: "Noida", state: "Uttar Pradesh", contact: "+91 8750096307", email: "qm@qatestinglaboratories.com" },
    { s_no: 35, name: "Stellar Test House", address: "G-68, Sector-63", city: "Noida", state: "Uttar Pradesh", contact: "+91 8130190099", email: "ankit@stellartesthouse.com" },
    { s_no: 36, name: "NBML Building Materials Testing Lab LLP", address: "Raipur Bilaspur Road, Near Akaswani Radio Station", city: "Raipur", state: "Chhattisgarh", contact: "+91 9881110389", email: "nbmtl2017@gmail.com" },
    { s_no: 37, name: "Eko Pro Engineers Private Limited", address: "32/37, South Side of G.T Road, Industrial Area", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 9810243870", email: "labs@ekopro.in" },
    { s_no: 38, name: "Indian Testing Laboratory Private Limited", address: "Plot No-248, Ecotech-III, Udyog Kendra-II", city: "Greater Noida", state: "Uttar Pradesh", contact: "+91 9999669383", email: "itlnoida.labs@gmail.com" },
    { s_no: 39, name: "ADS Labtech", address: "39/2/10-A, Site-IV, Sahibabad Industrial Area", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 7217808235", email: "shaktigroups@gmail.com" },
    { s_no: 40, name: "Pioneer Testing Laboratory Private Limited", address: "Kh No. 84/2, Street No. 4, Mundka Industrial Area", city: "Delhi", state: "Delhi", contact: "+91 9810040186", email: "pioneertestinglabdelhi@gmail.com" },
    { s_no: 41, name: "Micro Engineering And Testing Laboratory", address: "Plot No. 43, HSIIDC, Indl. Estate, Rai", city: "Sonipat", state: "Haryana", contact: "+91 9871143785", email: "METLSON@YAHOO.COM" },
    { s_no: 42, name: "Delta Testing and Research Laboratories", address: "Plot No. C-5, Block-C, Main Kanjhawala Road", city: "Delhi", state: "Delhi", contact: "+91 9811037450", email: "info@deltatestinglab.com" },
    { s_no: 43, name: "Ramco Research And Development Centre", address: "11A, Okkiyam, Thoraipakkam", city: "Chennai", state: "Tamil Nadu", contact: "9994446192", email: "trg@ramcocements.co.in" },
    { s_no: 44, name: "CIMEC Infralabs Private Limited", address: "Ground Floor, 179/13, Anand Industrial Area", city: "Ghaziabad", state: "Uttar Pradesh", contact: "+91 120 4156544", email: "vsr1960@gmail.com" },
    { s_no: 45, name: "DVG Laboratories & Consultants Pvt Ltd", address: "A2/71, Site-V, UPSIDC Industrial Area", city: "Greater Noida", state: "Uttar Pradesh", contact: "+91 9818254877", email: "dvglabs.testing@hotmail.com" },
    { s_no: 46, name: "Spectro SSA Labs Private Limited", address: "R-489, Sector 8, MIDC, TTC Industrial Area", city: "Rabale", state: "Maharashtra", contact: "+91 9769696069", email: "Ratan.Jotwani@xoin.eurofinsasia.com" },
    { s_no: 47, name: "Ramco Industries Limited", address: "No. 17, Winterpet Post", city: "Arakonam", state: "Tamil Nadu", contact: "+91 8838118563", email: "cpd@ril.co.in" },
    { s_no: 48, name: "Rahul Engineers Laboratory Private Limited", address: "5A-Chitrakut Nagar", city: "Udaipur", state: "Rajasthan", contact: "+91 8107343935", email: "rahul.labudr@gmail.com" }
  ]
};

export default function Labs() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-outline-variant/60 bg-surface px-8 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-headline-md font-semibold text-primary">BIS Testing Laboratories</h1>
          <p className="text-on-surface-variant text-[14px] mt-1">Explore certified laboratories for testing and compliance.</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Indian Standard</span>
              <div className="text-[16px] font-semibold text-on-surface">{labData.indian_standard}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {labData.labs.map((l, i) => (
              <div key={i} className="flex flex-col rounded-2xl bg-surface border border-outline-variant/60 shadow-sm hover:shadow-md hover:border-primary/40 overflow-hidden transition-all group">
                
                {/* Top Banner accent */}
                <div className="h-2 w-full bg-gradient-to-r from-primary to-tertiary opacity-80" />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">biotech</span>
                    </div>
                    <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-bold">
                      Lab #{l.s_no}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-on-surface mb-4 leading-tight line-clamp-2" title={l.name}>
                    {l.name}
                  </h3>

                  <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-outline-variant/30">
                    <div className="flex items-start gap-2.5 text-[13px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-on-surface-variant/70">location_on</span>
                      <span className="line-clamp-2 leading-relaxed" title={`${l.address}, ${l.city}, ${l.state}`}>{l.address}, <span className="font-medium text-on-surface">{l.city}</span>, {l.state}</span>
                    </div>

                    {l.contact !== "-" && (
                      <div className="flex items-center gap-2.5 text-[13px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] shrink-0 text-on-surface-variant/70">call</span>
                        <span className="font-medium text-on-surface">{l.contact}</span>
                      </div>
                    )}

                    {l.email && (
                      <div className="flex items-center gap-2.5 text-[13px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] shrink-0 text-on-surface-variant/70">mail</span>
                        <a href={`mailto:${l.email}`} className="font-medium text-primary hover:underline truncate" title={l.email}>{l.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
