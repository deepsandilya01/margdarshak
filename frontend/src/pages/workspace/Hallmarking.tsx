import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const goldData = {
  standard: "IS 1417",
  status: "Operative",
  records: [
    { sr_no: 1, license_no: "8290317917", name: "SWARNA MANDIR JEWELLERS", address: "1, NEW MARKET T T NAGAR, BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 2, license_no: "8290466926", name: "SHUBHAM JWELARS", address: "NEELBAD CHOURAHA BHADBHADAROAD", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 3, license_no: "8290073923", name: "AJAY JEWELLERS", address: "SARAFA CHOWK BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 4, license_no: "8290023318", name: "MAHALAXMI JEWELLERS", address: "SHOP NO.5, E-3/111, SHIVAM COMPLEX, ARERA COLINY, 10 NO. STOP", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 5, license_no: "8200029906", name: "HAR SIDDHI JEWELLERS", address: "SHOP NO.9, E-3/111 SHIVAM COMPLEX, ARERA COLONY", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 6, license_no: "8200032697", name: "NUPUR JEWELLERS", address: "SHOP NO.1,E-3/112, SHRADDHA COMPLEX, NEAR SBI MAHAVEER NAGAR BR.10 NO. AREARA COLONY", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 7, license_no: "8290064215", name: "SHRI ARTI JEWELLERS", address: "18, E3/111, SHIVAM COMPLEX, ARERA COLONY", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 8, license_no: "8290201720", name: "SHRI JANKI JEWELLERS", address: "H.NO.09, NEAR COCH FACTORY, KARARIYA FARM, CHANDBAD, BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 9, license_no: "8290465326", name: "SHREE MANGALAM JEWELLERS", address: "RAJ AVENUE 6, MINAL SHOPPING STREET NEAR GATE NO 2 MINAL RESIDENCY", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 10, license_no: "8290468223", name: "NAVNEET JEWELLERS", address: "GANDHI CHOWK MAIN MANDIR KE PASS", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 11, license_no: "8290024514", name: "BRIJ RATNAM", address: "173, ZONE II, M.P.NAGAR", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 12, license_no: "8290076222", name: "SHRINGAR JEWELLERS", address: "17, JAWAHAR BHAWAN, TT NAGAR", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 13, license_no: "8290064021", name: "RAVI JEWELLERS", address: "NEW B-4/33, NEAR PUNJAB NATIONAL BANK, BAIRAGARH", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 14, license_no: "8290019715", name: "D.P.ABHUSHAN LIMITED, DP JEWELLERS", address: "DB CITY MALL, GROUND FLOOR, OPP. APPLE STORE, M.P NAGAR, ARERA HILLS", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 15, license_no: "8290090620", name: "DEV SHREE JEWELLERS", address: "18, CHOWK BAZAR", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 16, license_no: "8290546924", name: "SHREE MANGALAM JEWELLERS", address: "03,SURENDRA LAND MARK,NARMADAPURAM ROAD, NEAR ASHIMA MALL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 17, license_no: "8290111315", name: "AMRAPALI JEWELLERS RATNA SHOWROOM", address: "SHOP NO G-4, GROUND FLOOR, KRIPAL COMPLEX 10 NO MARKET, 10 NO MARKET", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 18, license_no: "8290543522", name: "SR VIJAYVARGIYA JEWELLERS", address: "SHOP NO.SA-018,GROUND FLOOR,BLOCK-A, SHRISHTI CBD GAMON MALL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 19, license_no: "8290190523", name: "JEWELLERS SETHJI", address: "CHOWK BAZAAR RD, NEAR JAMA MASJID, LAKHERAPURA, PEER GATE AREA", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 20, license_no: "8290189724", name: "MAHAVEER JEWELLERS", address: "NEAR BUS STAND, VIDISHA RROAD", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 21, license_no: "8290203615", name: "S R JEWELLERS", address: "S NO 1 ANTA BABA MARKET LALWANI GALI, SARAFA CHOWK BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 22, license_no: "8290217719", name: "BHAWANI JEWELLERS", address: "SHOP 40 GHALA BAZAR, JAHANGIRABAD", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 23, license_no: "8290190919", name: "JEWELLERS SETHANI", address: "CHOWK BAZAAR RD, NEAR JAMA MASJID, LAKHERAPURA", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 24, license_no: "8290397723", name: "SALIGRAM RAMKISHAN", address: "04, SARAFA CHOWK", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 25, license_no: "8290080120", name: "RADHA KRISHNA JEWLLERS", address: "CHINTAMAN CHOURAHA MARWARI ROAD, BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 26, license_no: "8590059724", name: "M/S SWAROVSKI DB MALL", address: "STORE NO. G-39 AT DB MALL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 27, license_no: "8290422518", name: "ASHTALAKSHMI JEWELLERS", address: "SHOP NO. 9/48 NEW MARKET", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 28, license_no: "8290236824", name: "NAKSHATRA JEWELLERS", address: "41, MITTAL COMPLEX, LAKHERAPURA, BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 29, license_no: "8290218721", name: "GOVINDA JEWELLERS", address: "NAJIRABAD ROAD, BERASIA", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" },
    { sr_no: 30, license_no: "8290357525", name: "BLUESTONE JEWELLERY AND LIFESTYLE PVT LTD", address: "PRAKASH TOWER 14, MALVIYA NAGAR, RAJ BHAVAN ROAD, BHOPAL", city: "BHOPAL", state: "MADHYA PRADESH", country: "INDIA" }
  ]
};

const silverData = {
  indian_standard: "IS 269:2015",
  licenses: [
    { s_no: 1, licence_no: "8181373", firm_name_and_address: "Ultratech Cement Ltd (Bela Cement Works), Jaypee Puram", district: "REWA" },
    { s_no: 2, licence_no: "8107159", firm_name_and_address: "Ultratech Cement Limited (Unit: Maihar Cement Works), PO Sarla Nagar", district: "SATNA" },
    { s_no: 3, licence_no: "3083045", firm_name_and_address: "Ultratech Cement Ltd (Sidhi Cement Works), Jaypee Vihar, Village Maingawan", district: "SIDHI" },
    { s_no: 4, licence_no: "8212762", firm_name_and_address: "Prism Johnson Limited (Cement Division), Rajdeep Rewa Road", district: "SATNA" },
    { s_no: 5, licence_no: "8450677", firm_name_and_address: "Pioneer Industries, Village Jeerabad, Teh. Gandhwani", district: "DHAR" },
    { s_no: 6, licence_no: "8200070103", firm_name_and_address: "Creative Housewares (P) Ltd., Plot No. 31,32,33, Lamtra Industrial Area", district: "KATNI" },
    { s_no: 7, licence_no: "8200109104", firm_name_and_address: "Wonder Cement Limited, Plot No. 1-A & 1-B, Industrial Area, Kherwas, Badnawar", district: "DHAR" },
    { s_no: 8, licence_no: "8200003690", firm_name_and_address: "RCCPL Private Limited, Village Bhaurali Post Itahara", district: "SATNA" },
    { s_no: 9, licence_no: "8200152905", firm_name_and_address: "J.K. Cement Limited", district: "PANNA" },
    { s_no: 10, licence_no: "3165249", firm_name_and_address: "Prism Johnson Limited (Cement Division Unit-II), Rajdeep, Rewa Road", district: "SATNA" },
    { s_no: 11, licence_no: "2537356", firm_name_and_address: "KJS Cement Limited, Vill Amiliya, Rewa Road, NH7", district: "MAIHAR" },
    { s_no: 12, licence_no: "8200077614", firm_name_and_address: "UltraTech Cement Ltd (Unit Dhar Cement Works), Village Tonki, Tehsil Manawar", district: "DHAR" },
    { s_no: 13, licence_no: "8200132499", firm_name_and_address: "Sagar Cements (M) Private Limited, Vill Karondiya, PO Jeerabad", district: "DHAR" },
    { s_no: 14, licence_no: "8111453", firm_name_and_address: "Ultra Tech Cement Limited (Unit-Vikram Cement Works), P.O. Khor Tehsil Jawad", district: "NEEMUCH" },
    { s_no: 15, licence_no: "8256176", firm_name_and_address: "Birla Corporation Ltd, P.O Birla Vikas", district: "SATNA" },
    { s_no: 16, licence_no: "8342169", firm_name_and_address: "Nagori Cement Ltd., Bagh Distt", district: "DHAR" },
    { s_no: 17, licence_no: "2260440", firm_name_and_address: "ACC Limited, Kymore Cement Works, P.O. Kymore", district: "KATNI" },
    { s_no: 18, licence_no: "8166579", firm_name_and_address: "Jaypee Rewa Plant, Jaypee Nagar Distt Rewa", district: "REWA" },
    { s_no: 19, licence_no: "8066575", firm_name_and_address: "Diamond Cements, Village-Imlai, PO Imlai", district: "DAMOH" },
    { s_no: 20, licence_no: "8400102306", firm_name_and_address: "Shree Grinding Unit (A Unit of Shree Cement Ltd.)", district: "ALWAR" },
    { s_no: 21, licence_no: "3170444", firm_name_and_address: "Devshree Cement Limited", district: "JODHPUR" },
    { s_no: 22, licence_no: "8504573", firm_name_and_address: "Tiger Cement Pvt. Ltd", district: "BIKANER" },
    { s_no: 23, licence_no: "2558768", firm_name_and_address: "Shree Jaipur Cement Plant (Phulera, Jaipur)", district: "JAIPUR" },
    { s_no: 24, licence_no: "3095961", firm_name_and_address: "J.K. Cement Works (Unit of J.K. Cement Ltd.)", district: "NAGAUR" },
    { s_no: 25, licence_no: "8016358", firm_name_and_address: "Chanderia Cement Works", district: "CHITTORGARH" },
    { s_no: 26, licence_no: "2361143", firm_name_and_address: "JK Lakshmi Cement Limited", district: "SIROHI" },
    { s_no: 27, licence_no: "8651485", firm_name_and_address: "Meera Cement Private Limited", district: "NAGAUR" },
    { s_no: 28, licence_no: "8155271", firm_name_and_address: "Shravan Cements Pvt. Ltd.", district: "ALWAR" },
    { s_no: 29, licence_no: "3091145", firm_name_and_address: "UltraTech Cement Limited (Unit Kotputli Cement Works)", district: "JAIPUR" },
    { s_no: 30, licence_no: "8400161811", firm_name_and_address: "Great India Cement Pvt Ltd", district: "ALWAR" },
    { s_no: 31, licence_no: "8650887", firm_name_and_address: "Astha Cements Private Limited", district: "ALWAR" },
    { s_no: 32, licence_no: "3116236", firm_name_and_address: "Agarwal Cement & Chemicals (P) Ltd.", district: "NAGAUR" },
    { s_no: 33, licence_no: "2690263", firm_name_and_address: "Nuvoco Vistas Corporation Limited", district: "CHITTORGARH" },
    { s_no: 34, licence_no: "8217772", firm_name_and_address: "J.K. Cement Works", district: "CHITTORGARH" },
    { s_no: 35, licence_no: "8400156810", firm_name_and_address: "Shekhawati Cement", district: "JHUNJHUNU" },
    { s_no: 36, licence_no: "8609890", firm_name_and_address: "Sorabh Cement Limited", district: "SIKAR" },
    { s_no: 37, licence_no: "8400014410", firm_name_and_address: "Nuvoco Vistas Corporation Limited", district: "PALI" },
    { s_no: 38, licence_no: "8053162", firm_name_and_address: "Birla Cement Works", district: "CHITTORGARH" },
    { s_no: 39, licence_no: "8400244411", firm_name_and_address: "Tarun Industries", district: "JHALAWAR" },
    { s_no: 40, licence_no: "8400121512", firm_name_and_address: "Bangur Cement Unit", district: "GANGANAGAR" },
    { s_no: 41, licence_no: "8400331212", firm_name_and_address: "Bangur Cement Unit", district: "PALI" },
    { s_no: 42, licence_no: "8400159917", firm_name_and_address: "Ultimo Cement India Private Limited", district: "ALWAR" },
    { s_no: 43, licence_no: "8600115911", firm_name_and_address: "Ambuja Cements Limited", district: "NAGAUR" },
    { s_no: 44, licence_no: "8400175713", firm_name_and_address: "Jindal Shakti Cement", district: "DAUSA" },
    { s_no: 45, licence_no: "8146674", firm_name_and_address: "JCL Cements Pvt. Ltd.", district: "ALWAR" },
    { s_no: 46, licence_no: "8190576", firm_name_and_address: "Ambuja Cements Limited", district: "PALI" },
    { s_no: 47, licence_no: "8214059", firm_name_and_address: "Ultratech Cement Limited", district: "SIROHI" },
    { s_no: 48, licence_no: "8206868", firm_name_and_address: "Shri Ram Cement Works", district: "KOTA" },
    { s_no: 49, licence_no: "8159077", firm_name_and_address: "Nokha Cement Private Limited", district: "BIKANER" },
    { s_no: 50, licence_no: "8600120446", firm_name_and_address: "Gopalji Cement Private Limited", district: "ALWAR" }
  ]
};

type TabType = 'gold' | 'silver';

export default function Hallmarking() {
  const [activeTab, setActiveTab] = useState<TabType>('gold');

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-outline-variant/60 bg-surface px-8 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-headline-md font-semibold text-primary">Hallmarking Database</h1>
          <p className="text-on-surface-variant text-[14px] mt-1">Explore certified jewellers and licensed entities for Gold and Silver Hallmarking.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-outline-variant/50 pt-2">
          <button 
            onClick={() => setActiveTab('gold')}
            className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors ${activeTab === 'gold' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            Gold Hallmarking
          </button>
          <button 
            onClick={() => setActiveTab('silver')}
            className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors ${activeTab === 'silver' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            Silver Hallmarking
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'gold' && (
            <motion.div 
              key="gold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Standard</span>
                  <div className="text-[16px] font-semibold text-on-surface">{goldData.standard}</div>
                </div>
                <div>
                  <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-compliant-bg border border-status-compliant-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-compliant-dot" />
                    <span className="text-[12px] font-semibold text-status-compliant-text">{goldData.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goldData.records.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border border-outline-variant/50 bg-surface hover:border-primary/30 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">#{r.sr_no}</span>
                      <span className="font-mono text-[12px] font-semibold text-primary">{r.license_no}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-on-surface mb-2 line-clamp-2" title={r.name}>
                      {r.name}
                    </h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-start gap-1.5 text-[12px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">storefront</span>
                        <span className="line-clamp-2">{r.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {r.city}, {r.state}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'silver' && (
            <motion.div 
              key="silver"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Indian Standard</span>
                  <div className="text-[16px] font-semibold text-on-surface">{silverData.indian_standard}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {silverData.licenses.map((l, i) => (
                  <div key={i} className="p-4 rounded-xl border border-outline-variant/50 bg-surface hover:border-primary/30 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">#{l.s_no}</span>
                      <span className="font-mono text-[12px] font-semibold text-primary">{l.licence_no}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-on-surface mb-2 line-clamp-2" title={l.firm_name_and_address}>
                      {l.firm_name_and_address}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {l.district}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
