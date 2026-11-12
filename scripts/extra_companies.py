"""Campus recruiters that have no LeetCode company-tag data in the PDF.

They still get a full prep sheet on the site (links, references, highlights)
with questions taken from the closest category pack.
Category codes: S service, I Indian product/startup, B big tech/MNC product,
F banks/fintech, N infra/security/networking, H semiconductors/hardware,
Q quant/HFT, O other.
"""
EXTRA = {
    "S": """HCLTech; Tech Mahindra; LTIMindtree; Mphasis; Hexaware Technologies; Persistent Systems; Cyient; Zensar Technologies;
        Birlasoft; Coforge; NTT Data; DXC Technology; Virtusa; KPMG; EY; PwC; Sasken Technologies; Happiest Minds Technologies;
        L&T Technology Services; Tata Elxsi; Tata Technologies; Sonata Software; Mastek; Nagarro; Thoughtworks; Publicis Sapient;
        Globant; UST; Quest Global; Kyndryl; Atos; CGI; Fujitsu; Hitachi Vantara; NEC; Unisys; ITC Infotech; Mu Sigma;
        Fractal Analytics; Tiger Analytics; LatentView Analytics; Tredence; Sigmoid; Quantiphi; ZS Associates; Bain & Company;
        McKinsey & Company; Gartner; KPIT Technologies; Aveva; Ericsson Global Services; Infogain; Sutherland; Movate;
        Ness Digital Engineering; GlobalLogic; Altimetrik; Brillio; Mindtree""",
    "B": """Red Hat; Dell Technologies; HP; Hewlett Packard Enterprise; Lenovo; Ansys; PTC; Unity Technologies; Electronic Arts;
        Ubisoft; Sabre; Thomson Reuters; Wolters Kluwer; Elsevier; Optum; UnitedHealth Group; Philips; GE HealthCare;
        Siemens Healthineers; Honeywell; ABB; Schneider Electric; Continental; Mercedes-Benz Research and Development India;
        Volvo Group; Caterpillar; John Deere; Shell; Rolls-Royce; Emerson; Hitachi Energy; Rockwell Automation; Eaton; Danfoss;
        Tesco; Target; Lowe's; The Home Depot; Unilever; Procter & Gamble; GE Aerospace; Bosch Global Software Technologies;
        Mercedes-Benz; Ford; General Motors; Toyota Connected; Harman; Continental Automotive; Visteon; Collins Aerospace;
        Pratt & Whitney; Dassault Systemes; Hexagon; Trimble; Bentley; Infor; Epicor; Zebra Technologies; Diebold Nixdorf;
        NCR Voyix; Honeywell Technology Solutions; Kantar; Nielsen; Dun & Bradstreet; Experian; TransUnion; Equifax""",
    "F": """HSBC; Standard Chartered; Citi; UBS; Societe Generale; NatWest Group; Lloyds Banking Group; ANZ; Nomura; Mastercard;
        Fiserv; FIS; Moody's; S&P Global; MSCI; Fidelity Investments; Vanguard; State Street; Northern Trust; Kotak Mahindra Bank;
        HDFC Bank; ICICI Bank; State Bank of India; IndusInd Bank; Yes Bank; Razorpay; Zerodha; Upstox; Pine Labs; MobiKwik;
        Jupiter; Slice; OneCard; Digit Insurance; M2P Fintech; Setu; Perfios; Signzy; Rupeek; Jar; BharatPe; CRED; Lendingkart;
        PolicyBazaar; ClearTax; Khatabook; Fidelity International; Invesco; Franklin Templeton; Schwab; Charles Schwab; LSEG;
        Broadridge; Synchrony; Discover Financial Services; Ally Financial; Northern Arc; Mswipe""",
    "I": """Postman; Unacademy; PhysicsWallah; Udaan; Rapido; Spinny; Porter; upGrad; Byju's; Nykaa; Urban Company; ShareChat; Glance;
        Ola Electric; Ather Energy; BigBasket; Practo; PharmEasy; Tata 1mg; OYO; Ixigo; Chargebee; Whatfix; Innovaccer; HighRadius;
        Eightfold AI; Atlan; Hasura; Capillary Technologies; Druva; Icertis; LambdaTest; BrowserStack; Cohesity; Games24x7;
        Mobile Premier League; Gameberry Labs; Nazara Technologies; Simplilearn; Vedantu; Ninjacart; Yellow.ai; Haptik; Uniphore;
        Observe.AI; SigTuple; Niramai; Zepto; Lenskart; Dunzo; Sharechat; Rebel Foods; Cure.fit; Swiggy Instamart; Zoomcar;
        Cleartrip; Pocket FM; Kuku FM; Dailyhunt; InMobi; Exotel; Freshworks; Zluri; Sarvam AI; Krutrim; Rippling India;
        Fynd; Delhivery; Shiprocket; Blinkit; Tata Neu; Tata Digital; Jio Platforms; Reliance Retail; Airtel Digital; Paytm Money;
        Groww; Meesho; Nobroker; Housing.com; CarDekho; Cars24; Moglix; Infra.Market; OfBusiness; Zetwerk; Udemy India""",
    "N": """Juniper Networks; F5; Ericsson; Nokia; Ciena; Extreme Networks; Fortinet; Check Point Software Technologies;
        CrowdStrike; Cloudflare; Trellix; Sophos; Quick Heal; NetApp; Commvault; Veritas Technologies; Pure Storage; SUSE;
        Couchbase; Confluent; Elastic; HashiCorp; Citrix; Broadcom Software; Tejas Networks; Sterlite Technologies; Radisys;
        Mavenir; Aruba Networks; Infoblox; Imperva; Tenable; Qualys; Rapid7; SentinelOne; Barracuda Networks; Gen Digital;
        Proofpoint; Zoho ManageEngine; ManageEngine; Freshdesk; Cisco Meraki; Netskope; Illumio""",
    "H": """Texas Instruments; Microchip Technology; Marvell Technology; Western Digital; Seagate Technology; Infineon Technologies;
        NXP Semiconductors; MediaTek; Analog Devices; Micron Technology; Renesas Electronics; STMicroelectronics; Arm;
        Synopsys; Siemens EDA; Applied Materials; Lam Research; KLA; Keysight Technologies; Tessolve; Ittiam Systems;
        Samsung Semiconductor; Intel India; Rambus; Lattice Semiconductor; Silicon Labs; onsemi; ASML; Cypress Semiconductor;
        SanDisk; Kioxia; Ampere Computing; SiFive; Qualcomm India; Wipro VLSI; Moschip; Sankalp Semiconductor; eInfochips""",
    "Q": """Quadeye; AlphaGrep; NK Securities; Tower Research Capital; Optiver; Millennium; WorldQuant; Estee Advisors; iRage;
        Dolat Capital; Futures First; Jump Trading; Hudson River Trading; Virtu Financial; Susquehanna International Group;
        Maven Securities; Da Vinci Trading; Flow Traders; IMC Trading; Squarepoint; Graviton Research Capital; QRT;
        Qube Research & Technologies; Jane Street; Citadel Securities; Optiver India; Trexquant; PhonePe Quant""",
}

# Distinct organisations whose names merely prefix-match an existing company.
KEEP_SEPARATE = {"Infor", "Zoomcar", "Siemens Healthineers", "Siemens EDA", "Samsung Semiconductor", "Citadel Securities",
                 "Zoho ManageEngine", "Cisco Meraki", "Paytm Money", "Swiggy Instamart", "Airtel Digital", "Fidelity International"}
DROP = {"PhonePe Quant", "Optiver India", "Sharechat"}
CAT_CODES = {
    "S": "Service-based / Mass recruiters",
    "I": "Indian product companies & startups (OA-heavy)",
    "B": "",
    "F": "Banks, Payments & FinServ",
    "N": "Infra / Storage / Security / Networking",
    "H": "Semiconductors & Hardware",
    "Q": "Quant / HFT / Trading",
}


def items():
    for code, block in EXTRA.items():
        for name in block.split(";"):
            name = " ".join(name.split())
            if name and name not in DROP:
                yield name, CAT_CODES[code]
