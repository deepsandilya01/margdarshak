import React from 'react';
import { motion } from 'framer-motion';

const licensingData = {
  indian_standard: "IS 269:2015",
  licenses: [
    { s_no: 1, licence_no: "8181373", firm_name_and_address: "Ultratech Cement Ltd (Bela Cement Works), Jaypee Puram", district: "REWA" },
    { s_no: 2, licence_no: "8107159", firm_name_and_address: "Ultratech Cement Limited (Unit: Maihar Cement Works), PO Sarla Nagar", district: "SATNA" },
    { s_no: 3, licence_no: "3083045", firm_name_and_address: "Ultratech Cement Ltd (Sidhi Cement Works), Jaypee Vihar, Village Maingawan, PO Bharatpur", district: "SIDHI" },
    { s_no: 4, licence_no: "8212762", firm_name_and_address: "Prism Johnson Limited (Cement Division), Rajdeep Rewa Road", district: "SATNA" },
    { s_no: 5, licence_no: "8450677", firm_name_and_address: "Pioneer Industries, Village Jeerabad, Teh. Gandhwani", district: "DHAR" },
    { s_no: 6, licence_no: "8200070103", firm_name_and_address: "Creative Housewares (P) Ltd., Plot No. 31,32,33, Lamtra Industrial Area", district: "KATNI" },
    { s_no: 7, licence_no: "8200109104", firm_name_and_address: "Wonder Cement Limited, Plot No. 1-A & 1-B, Industrial Area, Kherwas, Badnawar", district: "DHAR" },
    { s_no: 8, licence_no: "8200003690", firm_name_and_address: "RCCPL Private Limited, Village Bhaurali Post Itahara", district: "SATNA" },
    { s_no: 9, licence_no: "8200152905", firm_name_and_address: "J.K. Cement Limited", district: "PANNA" },
    { s_no: 10, licence_no: "3165249", firm_name_and_address: "Prism Johnson Limited (Formerly Prism Cement Limited) (Cement Division Unit-II), Rajdeep, Rewa Road", district: "SATNA" },
    { s_no: 11, licence_no: "2537356", firm_name_and_address: "KJS Cement Limited, Vill Amiliya, Rewa Road, NH7", district: "MAIHAR" },
    { s_no: 12, licence_no: "8200077614", firm_name_and_address: "UltraTech Cement Ltd (Unit Dhar Cement Works), Village Tonki, Tehsil Manawar", district: "DHAR" },
    { s_no: 13, licence_no: "8200132499", firm_name_and_address: "Sagar Cements (M) Private Limited, Vill Karondiya, PO Jeerabad, Teh Gandhwani", district: "DHAR" },
    { s_no: 14, licence_no: "8111453", firm_name_and_address: "Ultra Tech Cement Limited (Unit-Vikram Cement Works), P.O. Khor Tehsil Jawad", district: "NEEMUCH" },
    { s_no: 15, licence_no: "8256176", firm_name_and_address: "Birla Corporation Ltd, P.O Birla Vikas", district: "SATNA" },
    { s_no: 16, licence_no: "8342169", firm_name_and_address: "Nagori Cement Ltd., Bagh Distt", district: "DHAR" },
    { s_no: 17, licence_no: "2260440", firm_name_and_address: "ACC Limited, Kymore Cement Works, P.O. Kymore", district: "KATNI" },
    { s_no: 18, licence_no: "8166579", firm_name_and_address: "Jaypee Rewa Plant, Jaypee Nagar Distt Rewa", district: "REWA" },
    { s_no: 19, licence_no: "8066575", firm_name_and_address: "Diamond Cements, Prop. HeidelbergCement India Ltd, Village-Imlai, PO Imlai", district: "DAMOH" },
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
    { s_no: 40, licence_no: "8400121512", firm_name_and_address: "Bangur Cement Unit (A Unit of Shree Cement Ltd)", district: "GANGANAGAR" },
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

export default function Licensing() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-outline-variant/60 bg-surface px-8 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-headline-md font-semibold text-primary">Licensing Database</h1>
          <p className="text-on-surface-variant text-[14px] mt-1">Explore certified licenses and manufacturing entities.</p>
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
              <div className="text-[16px] font-semibold text-on-surface">{licensingData.indian_standard}</div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="divide-y divide-outline-variant/40">
              {licensingData.licenses.map((l, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-surface-container-lowest transition-colors">
                  
                  {/* Left block: Sno and License No */}
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:w-[150px] shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[12px] font-bold">
                      {l.s_no}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                      <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                      <span className="font-mono text-[12px] font-bold text-primary">{l.licence_no}</span>
                    </div>
                  </div>

                  {/* Middle block: Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-on-surface mb-1 truncate" title={l.firm_name_and_address}>
                      {l.firm_name_and_address}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                        CEMENT
                      </span>
                    </div>
                  </div>

                  {/* Right block: District */}
                  <div className="flex items-center gap-2 md:w-[200px] shrink-0 text-on-surface-variant">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">location_city</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider">District</span>
                      <span className="text-[14px] font-medium text-on-surface truncate">{l.district}</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
